import { Router } from 'express'
import crypto from 'crypto'
import { authenticate, AuthRequest } from '../middleware/auth'
import { query, pool } from '../database/connection'
import { createError } from '../middleware/errorHandler'
import { config } from '../config'
import { randomUUID } from 'crypto'

const router = Router()

function authHeaders(provider: 'PAYSTACK' | 'FLUTTERWAVE') {
  return provider === 'PAYSTACK'
    ? { Authorization: `Bearer ${config.payments.paystackSecretKey}`, 'Content-Type': 'application/json' }
    : { Authorization: `Bearer ${config.payments.flutterwaveSecretKey}`, 'Content-Type': 'application/json' }
}

function secureEqual(a: string, b: string) {
  const left = Buffer.from(a, 'utf8')
  const right = Buffer.from(b, 'utf8')
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

async function finalizeWalletPayment(provider: string, reference: string, amount: number, metadata: any = {}) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const payment = await client.query(`SELECT * FROM payments WHERE provider = $1 AND provider_reference = $2 FOR UPDATE`, [provider, reference])
    if (!payment.rows.length) throw new Error('Payment record not found')
    const p = payment.rows[0]
    if (p.status === 'SUCCESS' && p.verified) { await client.query('COMMIT'); return p }
    if (p.type !== 'WALLET_FUND') throw new Error('Unsupported payment type')
    if (Number(p.amount) !== Number(amount)) throw new Error('Payment amount mismatch')

    const wallet = await client.query(`INSERT INTO wallets (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW() RETURNING *`, [p.user_id])
    const locked = await client.query(`SELECT * FROM wallets WHERE id = $1 FOR UPDATE`, [wallet.rows[0].id])
    const balanceAfter = Number(locked.rows[0].balance) + Number(amount)
    await client.query(`UPDATE wallets SET balance=$2,total_funded=total_funded+$2,updated_at=NOW() WHERE id=$1`, [locked.rows[0].id, amount])
    await client.query(`INSERT INTO wallet_transactions (wallet_id,user_id,amount,type,status,payment_provider,payment_reference,idempotency_key,balance_after,metadata) VALUES ($1,$2,$3,'FUND','COMPLETED',$4,$5,$6,$7,$8) ON CONFLICT (payment_reference) DO NOTHING`, [locked.rows[0].id, p.user_id, amount, provider, reference, p.idempotency_key, balanceAfter, metadata])
    await client.query(`UPDATE payments SET status='SUCCESS',verified=TRUE,metadata=metadata || $2::jsonb,updated_at=NOW() WHERE id=$1`, [p.id, JSON.stringify(metadata)])
    await client.query('COMMIT')
    return { ...p, status: 'SUCCESS', verified: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { client.release() }
}

router.post('/initialize', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { amount, provider = 'PAYSTACK', callbackUrl } = req.body ?? {}
    const numericAmount = Number(amount)
    const normalizedProvider = String(provider).toUpperCase()
    if (!Number.isFinite(numericAmount) || numericAmount < 100) return next(createError('amount must be at least ₦100', 400))
    if (!['PAYSTACK', 'FLUTTERWAVE'].includes(normalizedProvider)) return next(createError('Unsupported payment provider', 400))
    if (normalizedProvider === 'PAYSTACK' && !config.payments.paystackSecretKey) return next(createError('Paystack is not configured', 503))
    if (normalizedProvider === 'FLUTTERWAVE' && !config.payments.flutterwaveSecretKey) return next(createError('Flutterwave is not configured', 503))

    const user = await query('SELECT email,display_name FROM users WHERE id=$1 AND is_active=TRUE AND deleted_at IS NULL', [req.user!.id])
    if (!user.rows.length) return next(createError('User account not found', 404))
    const reference = `SF-${Date.now()}-${randomUUID().slice(0, 8)}`
    const idempotencyKey = randomUUID()
    await query(`INSERT INTO payments (user_id,amount,currency,provider,provider_reference,idempotency_key,type,status,metadata) VALUES ($1,$2,'NGN',$3,$4,$5,'WALLET_FUND','PENDING',$6)`, [req.user!.id, numericAmount, normalizedProvider, reference, idempotencyKey, JSON.stringify({ callbackUrl: callbackUrl || null })])

    let paymentUrl: string
    if (normalizedProvider === 'PAYSTACK') {
      const response = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: authHeaders('PAYSTACK'), body: JSON.stringify({ email: user.rows[0].email, amount: Math.round(numericAmount * 100), reference, callback_url: callbackUrl }) })
      const body = await response.json() as any
      if (!response.ok || !body.status) throw new Error(body.message || 'Paystack initialization failed')
      paymentUrl = body.data.authorization_url
    } else {
      const response = await fetch('https://api.flutterwave.com/v3/payments', { method: 'POST', headers: authHeaders('FLUTTERWAVE'), body: JSON.stringify({ tx_ref: reference, amount: numericAmount, currency: 'NGN', redirect_url: callbackUrl, customer: { email: user.rows[0].email, name: user.rows[0].display_name || user.rows[0].email }, customizations: { title: 'StoryFlow Wallet Funding' } }) })
      const body = await response.json() as any
      if (!response.ok || body.status !== 'success') throw new Error(body.message || 'Flutterwave initialization failed')
      paymentUrl = body.data.link
    }
    return res.status(201).json({ success: true, data: { reference, provider: normalizedProvider, paymentUrl, amount: numericAmount } })
  } catch (error) { next(error) }
})

router.post('/verify', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { provider = 'PAYSTACK', reference } = req.body ?? {}
    const normalizedProvider = String(provider).toUpperCase()
    if (!reference) return next(createError('reference is required', 400))
    const payment = await query(`SELECT * FROM payments WHERE provider=$1 AND provider_reference=$2 AND user_id=$3`, [normalizedProvider, reference, req.user!.id])
    if (!payment.rows.length) return next(createError('Payment not found', 404))

    let verifiedAmount = 0
    let metadata: any = {}
    if (normalizedProvider === 'PAYSTACK') {
      if (!config.payments.paystackSecretKey) return next(createError('Paystack is not configured', 503))
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: authHeaders('PAYSTACK') })
      const body = await response.json() as any
      if (!response.ok || !body.status || body.data?.status !== 'success') return next(createError('Payment could not be verified', 400))
      verifiedAmount = Number(body.data.amount) / 100
      metadata = { channel: body.data.channel, paidAt: body.data.paid_at, gatewayResponse: body.data.gateway_response }
    } else if (normalizedProvider === 'FLUTTERWAVE') {
      if (!config.payments.flutterwaveSecretKey) return next(createError('Flutterwave is not configured', 503))
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`, { headers: authHeaders('FLUTTERWAVE') })
      const body = await response.json() as any
      if (!response.ok || body.status !== 'success' || body.data?.status !== 'successful') return next(createError('Payment could not be verified', 400))
      verifiedAmount = Number(body.data.amount)
      metadata = { transactionId: body.data.id, chargedAmount: body.data.charged_amount }
    } else return next(createError('Unsupported payment provider', 400))

    const finalized = await finalizeWalletPayment(normalizedProvider, reference, verifiedAmount, metadata)
    return res.json({ success: true, data: { verified: true, payment: finalized } })
  } catch (error) { next(error) }
})

router.post('/webhook/paystack', async (req, res, next) => {
  try {
    const signature = String(req.headers['x-paystack-signature'] || '')
    const rawBody = (req as any).rawBody as Buffer | undefined
    if (!config.payments.paystackSecretKey || !signature || !rawBody) return res.status(401).json({ success: false })
    const expected = crypto.createHmac('sha512', config.payments.paystackSecretKey).update(rawBody).digest('hex')
    if (!secureEqual(signature, expected)) return res.status(401).json({ success: false })
    if (req.body?.event === 'charge.success') {
      const reference = req.body?.data?.reference
      const amount = Number(req.body?.data?.amount) / 100
      if (reference && Number.isFinite(amount)) await finalizeWalletPayment('PAYSTACK', reference, amount, { webhookEvent: req.body.event })
    }
    return res.json({ success: true })
  } catch (error) { next(error) }
})

router.post('/webhook/flutterwave', async (req, res, next) => {
  try {
    const signature = String(req.headers['verif-hash'] || '')
    if (!config.payments.flutterwaveSecretHash || !signature || signature !== config.payments.flutterwaveSecretHash) return res.status(401).json({ success: false })
    const reference = req.body?.data?.tx_ref
    const amount = Number(req.body?.data?.amount)
    if (req.body?.event === 'charge.completed' && reference && Number.isFinite(amount)) await finalizeWalletPayment('FLUTTERWAVE', reference, amount, { webhookEvent: req.body.event, transactionId: req.body?.data?.id })
    return res.json({ success: true })
  } catch (error) { next(error) }
})

router.get('/history', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await query(`SELECT * FROM payments WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`, [req.user!.id])
    return res.json({ success: true, data: result.rows })
  } catch (error) { next(error) }
})

export const paymentRoutes = router
