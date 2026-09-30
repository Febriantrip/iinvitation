import express from 'express'
import fs from 'node:fs/promises'
import { config } from './config.js'
import { adminRouter } from './modules/admin/routes.js'
import { publicRouter } from './modules/public/routes.js'
import { mediaRouter } from './modules/media/routes.js'

export async function createApp() {
  await fs.mkdir(config.uploadDir, { recursive: true })
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 1)
  app.use(express.json({ limit: '2mb' }))
  app.use('/uploads', express.static(config.uploadDir, { maxAge: '7d', immutable: false }))
  app.get('/', (_req, res) => res.json({ ok: true, service: 'Iinvitation API', database: 'MySQL' }))
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Iinvitation API', database: 'MySQL' }))
  app.use('/api', adminRouter)
  app.use('/api', publicRouter)
  app.use('/api', mediaRouter)
  app.use((error, _req, res, _next) => {
    console.error(error)
    if (error?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'File terlalu besar.' })
    if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) return res.status(409).json({ message: 'Data duplikat. Cek slug atau token tamu.' })
    if (Number(error?.status) >= 400 && Number(error?.status) < 600) return res.status(Number(error.status)).json({ message: error.message || 'Request tidak dapat diproses.' })
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  })
  return app
}
