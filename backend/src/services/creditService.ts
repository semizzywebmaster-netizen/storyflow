import { pool } from '../database/connection'

export class CreditService {
  async reserveCredits(userId: string, amount: number, referenceId: string, description: string): Promise<{ success: boolean; balanceAfter: number }> {
    if (!Number.isInteger(amount) || amount <= 0) throw new Error('Credit amount must be a positive integer')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const existing = await client.query('SELECT balance_after FROM credit_transactions WHERE user_id = $1 AND reference_id = $2 LIMIT 1', [userId, referenceId])
      if (existing.rows.length) { await client.query('COMMIT'); return { success: true, balanceAfter: Number(existing.rows[0].balance_after) } }
      const user = await client.query('SELECT credits FROM users WHERE id = $1 FOR UPDATE', [userId])
      if (!user.rows.length) throw new Error('User not found')
      const balance = Number(user.rows[0].credits)
      if (balance < amount) throw new Error('Insufficient credits')
      const updated = await client.query('UPDATE users SET credits = credits - $1, updated_at = NOW() WHERE id = $2 RETURNING credits', [amount, userId])
      const balanceAfter = Number(updated.rows[0].credits)
      await client.query(`INSERT INTO credit_transactions (user_id, amount, type, description, reference_id, balance_after) VALUES ($1, $2, 'GENERATION', $3, $4::uuid, $5)`, [userId, -amount, description, referenceId, balanceAfter])
      await client.query('COMMIT')
      return { success: true, balanceAfter }
    } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  }

  async consumeReservedCredits(userId: string, referenceId: string | null): Promise<void> {
    if (!referenceId) throw new Error('Credit reservation reference is required')
    const result = await pool.query(`UPDATE credit_transactions SET metadata = metadata || '{"state":"CONSUMED"}'::jsonb WHERE user_id = $1 AND reference_id = $2::uuid AND COALESCE(metadata->>'state','RESERVED') = 'RESERVED'`, [userId, referenceId])
    if (result.rowCount === 0) throw new Error('Credit reservation not found or already finalized')
  }

  async releaseReservedCredits(userId: string, amount: number, referenceId: string, reason: string): Promise<void> {
    if (!Number.isInteger(amount) || amount <= 0) throw new Error('Credit amount must be a positive integer')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const reservation = await client.query(`SELECT id FROM credit_transactions WHERE user_id = $1 AND reference_id = $2::uuid AND COALESCE(metadata->>'state','RESERVED') = 'RESERVED' FOR UPDATE`, [userId, referenceId])
      if (!reservation.rows.length) throw new Error('Credit reservation not found or already finalized')
      const updated = await client.query('UPDATE users SET credits = credits + $1, updated_at = NOW() WHERE id = $2 RETURNING credits', [amount, userId])
      if (!updated.rows.length) throw new Error('User not found')
      const balanceAfter = Number(updated.rows[0].credits)
      await client.query(`UPDATE credit_transactions SET metadata = metadata || '{"state":"RELEASED"}'::jsonb WHERE id = $1`, [reservation.rows[0].id])
      await client.query(`INSERT INTO credit_transactions (user_id, amount, type, description, reference_id, balance_after, metadata) VALUES ($1, $2, 'REFUND', $3, $4::uuid, $5, '{"state":"REFUND"}'::jsonb)`, [userId, amount, reason, referenceId, balanceAfter])
      await client.query('COMMIT')
    } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  }

  async addBonusCredits(userId: string, amount: number, reason: string): Promise<void> {
    if (!Number.isInteger(amount) || amount <= 0) throw new Error('Credit amount must be a positive integer')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const updated = await client.query('UPDATE users SET credits = credits + $1, updated_at = NOW() WHERE id = $2 RETURNING credits', [amount, userId])
      if (!updated.rows.length) throw new Error('User not found')
      await client.query(`INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata) VALUES ($1, $2, 'BONUS', $3, $4, '{"state":"COMPLETED"}'::jsonb)`, [userId, amount, reason, Number(updated.rows[0].credits)])
      await client.query('COMMIT')
    } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
  }

  async getBalance(userId: string): Promise<number> { const result = await pool.query('SELECT credits FROM users WHERE id = $1', [userId]); if (!result.rows.length) throw new Error('User not found'); return Number(result.rows[0].credits) }
  async getHistory(userId: string, limit = 50): Promise<any[]> { const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100); const result = await pool.query(`SELECT id, amount, type, description, reference_id AS "referenceId", balance_after AS "balanceAfter", metadata, created_at AS "createdAt" FROM credit_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`, [userId, safeLimit]); return result.rows }
}

export const creditService = new CreditService()
