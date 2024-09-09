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
  origin: 'http://localhost:5173', // url permitida
  credentials: true, // Permite el envío de cookies y encabezados de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}
// middleware de CORS
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('<h1>Hello Pplon</h1>')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password }) // Aquí obtenemos el rol del usuario
    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      SECRET_JWT_KEY, {
        expiresIn: '1h'
      }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // proteccion csrf
        maxAge: 3600000 // 1h
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password, rol } = req.body
  console.log(req.body)
  try {
    const id = await UserRepository.create({ username, password, rol })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access_token').send({ message: 'Logged out successfully' })
})

app.get('/dashboard', (req, res) => {
  const token = req.cookies.access_token
  if (!token) return res.status(403).send('Access denied')

  try {
    const verified = jwt.verify(token, SECRET_JWT_KEY)
    console.log('Token verified:', verified) // Para depurar
    res.send({ user: verified })
  } catch (error) {
    console.error('Token verification failed:', error) // Para depurar
    res.status(401).send('Invalid token')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
