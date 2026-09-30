import { createApp } from './app.js'
import { config } from './config.js'
import { ensureDatabase, pool } from './db/pool.js'
import { migrate } from './db/migrate.js'
import { seed } from './db/seed.js'

async function main() {
  await ensureDatabase()
  await migrate()
  await seed()
  await pool.query('DELETE FROM admin_sessions WHERE expires_at <= CURRENT_TIMESTAMP(3)')
  const app = await createApp()
  app.listen(config.port, () => {
    console.log(`[iinvitation-api] MySQL ${config.db.host}:${config.db.port}/${config.db.database}`)
    console.log(`[iinvitation-api] listening on http://localhost:${config.port}`)
  })
}

main().catch(error => {
  if (error?.code === 'ECONNREFUSED') {
    console.error(`[iinvitation-api] MySQL tidak dapat dihubungi di ${config.db.host}:${config.db.port}. Pastikan service MySQL sudah running.`)
  } else if (error?.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('[iinvitation-api] Login MySQL ditolak. Cek DB_USER dan DB_PASSWORD di server/.env.')
  } else {
    console.error(error)
  }
  process.exit(1)
})
