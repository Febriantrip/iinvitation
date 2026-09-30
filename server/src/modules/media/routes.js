import express from 'express'
import multer from 'multer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { config } from '../../config.js'
import { requireAdmin } from '../../middleware/auth.js'

export const mediaRouter = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

const extensions = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif',
  'audio/mpeg': '.mp3', 'audio/ogg': '.ogg', 'audio/wav': '.wav', 'audio/mp4': '.m4a',
}

mediaRouter.post('/admin/media', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File belum dipilih.' })
    const ext = extensions[req.file.mimetype]
    if (!ext) return res.status(415).json({ message: 'Format file tidak didukung.' })
    const kind = req.file.mimetype.startsWith('image/') ? 'image' : 'audio'
    const max = kind === 'image' ? 12 * 1024 * 1024 : 20 * 1024 * 1024
    if (req.file.size > max) return res.status(413).json({ message: `File ${kind} terlalu besar.` })
    await fs.mkdir(config.uploadDir, { recursive: true })
    const fileName = `${randomUUID()}${ext}`
    await fs.writeFile(path.join(config.uploadDir, fileName), req.file.buffer)
    res.status(201).json({ url: `/uploads/${fileName}`, kind, size: req.file.size })
  } catch (error) { next(error) }
})

mediaRouter.delete('/admin/media', requireAdmin, async (req, res, next) => {
  try {
    const url = String(req.query.url || '')
    if (!url.startsWith('/uploads/')) return res.status(204).end()
    const name = path.basename(url)
    const target = path.join(config.uploadDir, name)
    if (!target.startsWith(config.uploadDir)) return res.status(400).json({ message: 'Path tidak valid.' })
    await fs.rm(target, { force: true })
    res.status(204).end()
  } catch (error) { next(error) }
})
