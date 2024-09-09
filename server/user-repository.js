import mysql from 'mysql2/promise'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123494',
  database: 'mapa_interactivo'
})

export class UserRepository {
  static async create ({ username, password, rol }) {
    Validation.username(username)
    Validation.password(password)

    const [rows] = await connection.execute('SELECT * FROM User WHERE username = ?', [username])
    if (rows.length > 0) throw new Error('User already exists')

    const id = crypto.randomUUID()
    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS)

    await connection.execute(
      'INSERT INTO User (_id, username, password, rol) VALUES (?, ?, ?, ?)',
      [id, username, hashedPassword, rol]
    )
    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const [rows] = await connection.execute('SELECT * FROM User WHERE username = ?', [username])
    if (rows.length === 0) throw new Error('username does not exist')

    const user = rows[0]
    const isValid = bcrypt.compareSync(password, user.password)
    if (!isValid) throw new Error('password is invalid')

    const { password: _, ...publicUser } = user

    return {
      username: publicUser.username,
      id: publicUser._id,
      rol: publicUser.rol // Incluimos el rol en la respuesta
    }
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 3 characters')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 6 characters')
  }
}
