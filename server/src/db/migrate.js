import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rawPool } from './pool.js'
import { config } from '../config.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const sqlPath = path.resolve(here, '../../sql/001_init.sql')

function splitStatements(sql) {
  return sql.split(';').map(statement => statement.trim()).filter(Boolean)
}

async function hasColumn(table, column) {
  const [rows] = await rawPool.query(`SELECT COUNT(*) AS total FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND COLUMN_NAME=?`, [config.db.database, table, column])
  return Number(rows[0]?.total || 0) > 0
}

async function ensureColumn(table, column, definition) {
  if (await hasColumn(table, column)) return
  await rawPool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`)
  console.log(`[migration] ${table}.${column} added`)
}

export async function migrate() {
  const sql = await fs.readFile(sqlPath, 'utf8')
  for (const statement of splitStatements(sql)) await rawPool.query(statement)

  // Upgrade-safe additions for existing V2.2 databases (works with MySQL/MariaDB XAMPP).
  await ensureColumn('invitations', 'client_name', "VARCHAR(255) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'theme_id', "VARCHAR(80) NOT NULL DEFAULT 'botanical-serenity'")
  await ensureColumn('invitations', 'hero_edit_json', 'TEXT NULL')
  await ensureColumn('invitations', 'template_settings_json', 'TEXT NULL')
  await ensureColumn('invitations', 'section_settings_json', 'TEXT NULL')
  await ensureColumn('invitations', 'project_status', "VARCHAR(32) NOT NULL DEFAULT 'published'")
  await ensureColumn('invitations', 'publication_status', "VARCHAR(20) NOT NULL DEFAULT 'published'")
  await ensureColumn('invitations', 'review_status', "VARCHAR(24) NOT NULL DEFAULT 'not_sent'")
  await ensureColumn('invitations', 'review_token', "VARCHAR(64) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'preview_token', "VARCHAR(64) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'published_at', 'DATETIME(3) NULL')
  await ensureColumn('invitations', 'expires_at', 'DATETIME(3) NULL')

  await rawPool.query(`CREATE TABLE IF NOT EXISTS client_review_notes (
    id VARCHAR(36) PRIMARY KEY,
    invitation_id VARCHAR(36) NOT NULL,
    author ENUM('admin','client') NOT NULL DEFAULT 'admin',
    kind ENUM('comment','revision','approval','system') NOT NULL DEFAULT 'comment',
    section_key VARCHAR(80) NOT NULL DEFAULT 'general',
    message TEXT NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX idx_review_notes_invitation (invitation_id, created_at),
    CONSTRAINT fk_review_notes_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`)

  await ensureColumn('gallery_items', 'edit_json', 'TEXT NULL')

  await ensureColumn('invitations', 'feature_website', 'TINYINT(1) NOT NULL DEFAULT 1')
  await ensureColumn('invitations', 'feature_guestbook', 'TINYINT(1) NOT NULL DEFAULT 0')
  await ensureColumn('invitations', 'feature_frame', 'TINYINT(1) NOT NULL DEFAULT 0')
  await ensureColumn('invitations', 'guestbook_pin', "VARCHAR(12) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'frame_preset', "VARCHAR(32) NOT NULL DEFAULT 'heritage'")
  await ensureColumn('invitations', 'frame_names', "VARCHAR(255) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'frame_date_label', "VARCHAR(120) NOT NULL DEFAULT ''")
  await ensureColumn('invitations', 'frame_overlay', 'INT NOT NULL DEFAULT 22')
  await ensureColumn('guests', 'invited_pax', 'INT NOT NULL DEFAULT 1')

  await rawPool.query(`UPDATE invitations SET client_name=TRIM(CONCAT(bride_name, ' & ', groom_name)) WHERE client_name='' OR client_name IS NULL`)
  await rawPool.query(`UPDATE invitations SET theme_id='botanical-serenity' WHERE theme_id='' OR theme_id IS NULL`)
  await rawPool.query(`UPDATE invitations SET guestbook_pin=RIGHT(CONCAT('000000', MOD(CRC32(id), 1000000)), 6) WHERE guestbook_pin='' OR guestbook_pin IS NULL`)
  await rawPool.query(`UPDATE invitations SET frame_names=TRIM(CONCAT(bride_name, ' & ', groom_name)) WHERE frame_names='' OR frame_names IS NULL`)
  await rawPool.query(`UPDATE invitations SET frame_date_label=DATE_FORMAT(STR_TO_DATE(LEFT(event_date,10), '%Y-%m-%d'), '%d · %m · %Y') WHERE frame_date_label='' OR frame_date_label IS NULL`)
  await rawPool.query(`UPDATE invitations SET review_token=REPLACE(UUID(),'-','') WHERE review_token='' OR review_token IS NULL`)
  await rawPool.query(`UPDATE invitations SET preview_token=REPLACE(UUID(),'-','') WHERE preview_token='' OR preview_token IS NULL`)
  await rawPool.query(`UPDATE invitations SET project_status='published' WHERE project_status='' OR project_status IS NULL`)
  await rawPool.query(`UPDATE invitations SET publication_status='published' WHERE publication_status='' OR publication_status IS NULL`)
}
