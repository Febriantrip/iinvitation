import { config } from './config.js'
import { ensureDatabase, pool, rawPool } from './db/pool.js'
import { migrate } from './db/migrate.js'

const requiredInvitationColumns = [
  'project_status',
  'publication_status',
  'review_status',
  'review_token',
  'preview_token',
  'published_at',
  'expires_at',
]

async function verifySchema() {
  const [columnRows] = await rawPool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME='invitations'`,
    [config.db.database],
  )
  const columns = new Set(columnRows.map(row => row.COLUMN_NAME))
  const missingColumns = requiredInvitationColumns.filter(column => !columns.has(column))

  const [tableRows] = await rawPool.query(
    `SELECT COUNT(*) AS total FROM information_schema.TABLES
     WHERE TABLE_SCHEMA=? AND TABLE_NAME='client_review_notes'`,
    [config.db.database],
  )
  const hasReviewTable = Number(tableRows[0]?.total || 0) > 0

  if (missingColumns.length || !hasReviewTable) {
    const details = [
      missingColumns.length ? `kolom hilang: ${missingColumns.join(', ')}` : '',
      !hasReviewTable ? 'tabel hilang: client_review_notes' : '',
    ].filter(Boolean).join(' | ')
    throw new Error(`Verifikasi schema V5 gagal (${details})`)
  }

  console.log('[migration] V5 workflow schema verified')
}

async function main() {
  await ensureDatabase()
  await migrate()
  await verifySchema()
  console.log(`[migration] MySQL ${config.db.host}:${config.db.port}/${config.db.database} ready`)
}

main()
  .catch(error => {
    console.error('[migration] ERROR:', error?.message || error)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end().catch(() => {})
  })
