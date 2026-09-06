import fs from 'fs'
import path from 'path'
import { pool } from './connection'

const migrationsDir = path.join(__dirname, 'migrations')

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    const files = fs.existsSync(migrationsDir)
      ? fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort()
      : []

    for (const file of files) {
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE id = $1', [file])
      if (applied.rowCount) continue

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file])
      console.log(`[DB] Applied migration ${file}`)
    }

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((error) => {
  console.error('[DB] Migration failed', error)
  process.exit(1)
})
