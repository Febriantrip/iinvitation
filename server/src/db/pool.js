import mysql from 'mysql2/promise'
import { config } from '../config.js'

const baseOptions = {
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  charset: 'utf8mb4',
}

export const rawPool = mysql.createPool({
  ...baseOptions,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
  dateStrings: false,
})

const wrapResult = result => {
  const [rows] = result
  if (Array.isArray(rows)) return { rows, rowCount: rows.length }
  return {
    rows: [],
    rowCount: Number(rows?.affectedRows || 0),
    insertId: rows?.insertId,
  }
}

export const pool = {
  async query(sql, params = []) {
    return wrapResult(await rawPool.query(sql, params))
  },
  async end() {
    await rawPool.end()
  },
}

export async function ensureDatabase() {
  const connection = await mysql.createConnection(baseOptions)
  try {
    const dbName = String(config.db.database).replace(/`/g, '``')
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  } finally {
    await connection.end()
  }
}

export async function withTransaction(work) {
  const connection = await rawPool.getConnection()
  const client = {
    async query(sql, params = []) {
      return wrapResult(await connection.query(sql, params))
    },
  }
  try {
    await connection.beginTransaction()
    const result = await work(client)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
