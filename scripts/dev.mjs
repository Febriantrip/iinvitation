import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const serverDir = path.join(root, 'server')
const envExample = path.join(serverDir, '.env.example')
const envFile = path.join(serverDir, '.env')
const viteEntry = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')

function npmInstall() {
  const npmCli = process.env.npm_execpath
  if (!npmCli) {
    console.error('[bootstrap] npm_execpath tidak tersedia. Jalankan: npm install')
    process.exit(1)
  }
  const result = spawnSync(process.execPath, [npmCli, 'install'], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function dependencyReady() {
  return fs.existsSync(viteEntry)
    && fs.existsSync(path.join(root, 'node_modules', 'react', 'package.json'))
    && fs.existsSync(path.join(root, 'node_modules', 'mysql2', 'package.json'))
    && fs.existsSync(path.join(root, 'node_modules', 'qrcode', 'package.json'))
}

function canListen(port) {
  return new Promise(resolve => {
    const server = net.createServer()
    server.unref()
    server.once('error', () => resolve(false))
    server.listen({ port, host: '0.0.0.0', exclusive: true }, () => {
      server.close(() => resolve(true))
    })
  })
}

async function findPort(start, end) {
  for (let port = start; port <= end; port += 1) {
    if (await canListen(port)) return port
  }
  throw new Error(`Tidak ada port kosong pada rentang ${start}-${end}.`)
}

function openBrowser(url) {
  if (String(process.env.IINVITATION_NO_OPEN || '').toLowerCase() === 'true') return
  try {
    if (process.platform === 'win32') {
      const child = spawn('cmd.exe', ['/d', '/s', '/c', 'start', '""', url], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      })
      child.unref()
    } else if (process.platform === 'darwin') {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref()
    } else {
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref()
    }
  } catch {
    // Browser auto-open is optional; printed URL remains available.
  }
}

if (!fs.existsSync(envFile)) {
  fs.copyFileSync(envExample, envFile)
  console.log('[bootstrap] server/.env dibuat otomatis dari .env.example')
}

if (!dependencyReady()) {
  console.log('[bootstrap] Dependency belum lengkap. Menjalankan npm install...')
  npmInstall()
}

const apiPort = await findPort(8787, 8899)
const webPort = await findPort(5173, 5299)
const webUrl = `http://localhost:${webPort}`
const apiUrl = `http://localhost:${apiPort}`

console.log('')
console.log('====================================================')
console.log(' Iinvitation Unified Platform V5.1 + MySQL')
console.log(` Website   : ${webUrl}`)
console.log(` Admin     : ${webUrl}/admin`)
console.log(` API       : ${apiUrl}/api/health`)
console.log(` Guestbook : ${webUrl}/checkin/{slug}`)
console.log(` Frame     : ${webUrl}/frame/{slug}`)
console.log(` Review    : ${webUrl}/review/{token}`)
console.log(' LAN       : gunakan IP PC dengan port Website di atas')
console.log('====================================================')
console.log('Port Web/API dipilih otomatis. Project lain tidak dihentikan.')
console.log('Pastikan MySQL/XAMPP MySQL sudah RUNNING.')
console.log('Tekan Ctrl+C untuk menghentikan Iinvitation.\n')

const api = spawn(process.execPath, [path.join(serverDir, 'src', 'index.js')], {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: String(apiPort) },
})

const web = spawn(process.execPath, [viteEntry, '--host', '0.0.0.0', '--port', String(webPort), '--strictPort'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, IINVITATION_API_PORT: String(apiPort) },
})

const children = [api, web]
let stopping = false
let browserOpened = false

const browserTimer = setTimeout(() => {
  browserOpened = true
  openBrowser(webUrl)
}, 1200)

function stop(code = 0) {
  if (stopping) return
  stopping = true
  clearTimeout(browserTimer)
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(code), 300)
}

for (const child of children) {
  child.on('exit', code => {
    if (!stopping && code !== 0) stop(code || 1)
  })
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
process.on('exit', () => {
  if (!browserOpened) clearTimeout(browserTimer)
})
