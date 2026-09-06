
import { Pool } from 'pg'
import { config } from '../config'

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('connect', () => {
  console.log('[DB] Connected to PostgreSQL')
})

pool.on('error', (err) => {
  console.error('[DB] Unexpected error', err)
})

export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('[DB] Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount })
  return res
}
