import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin: '*', // url permitida
  credentials: true, // Permite el envío de cookies y encabezados de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}
// middleware de CORS
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('<h1>Hello Pplon</h1>')
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  try {
    const user = UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username }, SECRET_JWT_KEY, {
        expiresIn: '1h'
      })
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // proteccion csrf
        maxAge: 3600000 // 1h
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})
app.post('/register', (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
  try {
    const id = UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.post('/logout', (req, res) => {})

app.post('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
