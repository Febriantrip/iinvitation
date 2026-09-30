import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const mustExist = [
  'src/main.tsx',
  'src/App.tsx',
  'src/marketing/MarketingApp.jsx',
  'src/marketing/styles.css',
  'vite.config.ts',
]
const mustNotExist = [
  'src/App.jsx',
  'src/main.jsx',
  'vite.config.js',
  'src/sections',
  'src/data/siteData.js',
]

for (const rel of mustExist) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`File wajib tidak ditemukan: ${rel}`)
}
for (const rel of mustNotExist) {
  if (fs.existsSync(path.join(root, rel))) failures.push(`Legacy duplicate masih ada: ${rel}`)
}

function text(rel) { return fs.readFileSync(path.join(root, rel), 'utf8') }
if (fs.existsSync(path.join(root, 'src/main.tsx'))) {
  const source = text('src/main.tsx')
  if (!source.includes("import App from './App'")) failures.push('src/main.tsx tidak memakai App unified.')
  if (!source.includes("import './styles.css'")) failures.push('Global stylesheet admin/public tidak di-import.')
}
if (fs.existsSync(path.join(root, 'src/marketing/MarketingApp.jsx'))) {
  const source = text('src/marketing/MarketingApp.jsx')
  if (!source.includes("import './styles.css'")) failures.push('Marketing stylesheet tidak di-import.')
  if (!source.includes('className="marketing-site"')) failures.push('Wrapper .marketing-site hilang; CSS marketing tidak akan aktif.')
  if (source.includes('Alyatation')) failures.push('Nama bisnis lama masih ada di MarketingApp.')
}
if (fs.existsSync(path.join(root, 'src/marketing/styles.css'))) {
  const css = text('src/marketing/styles.css')
  if (!css.includes('.marketing-site .hero')) failures.push('CSS marketing tidak lengkap: .marketing-site .hero tidak ditemukan.')
  if (!css.includes('.marketing-site .site-header')) failures.push('CSS marketing tidak lengkap: header rules tidak ditemukan.')
}

if (failures.length) {
  console.error('\n[check:source] GAGAL')
  for (const item of failures) console.error(` - ${item}`)
  process.exit(1)
}
console.log('[check:source] OK - entrypoint, CSS marketing, branding, dan duplicate source bersih.')
