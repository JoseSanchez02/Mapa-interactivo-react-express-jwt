import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import cors from 'cors'
import { MarkerRepository } from './marker-repository.js'
import { CrimeRepository } from './crime-repository.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin: 'http://localhost:5173', // url permitida
  credentials: true, // Permite el envío de cookies y headers de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization']
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
        expiresIn: '100h'
      }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // proteccion csrf
        maxAge: 360000000 // 100h
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
  const token = req.cookies.access_token // Extrae el token de las cookies

  // Si no hay token en las cookies, devuelve un 403 (Forbidden)
  if (!token) return res.status(403).json({ message: 'Access denied. No token provided.' })

  try {
    // Verifica el token
    const verified = jwt.verify(token, SECRET_JWT_KEY)
    console.log('Token verified:', verified) // Para depuración

    // Si el token es válido, envía la información del usuario
    res.status(200).json({ user: verified })
  } catch (error) {
    // Si la verificación falla, devuelve un 401 (Unauthorized)
    console.error('Token verification failed:', error.message) // Para depuración
    res.status(401).json({ message: 'Invalid token' })
  }
})

app.post('/markers', async (req, res) => {
  const { lat, lng, iconType } = req.body
  try {
    const marker = await MarkerRepository.createMarker({ lat, lng, iconType })
    // Devolver el objeto en el formato que espera el frontend
    res.send({
      id: marker.id,
      position: {
        lat: parseFloat(marker.lat),
        lng: parseFloat(marker.lng)
      },
      iconType: marker.iconType
    })
  } catch (error) {
    res.status(500).send('Error al guardar el marcador')
  }
})

app.get('/markers', async (req, res) => {
  try {
    // En lugar de obtener marcadores por usuario, devuelves todos los marcadores
    const markers = await MarkerRepository.getAllMarkers()// Supongamos que este método obtiene todos los markers
    res.send(markers)
  } catch (error) {
    res.status(500).send({ message: 'Error al obtener los marcadores' })
  }
})

app.delete('/markers/:id', async (req, res) => {
  const { id } = req.params
  const token = req.cookies.access_token

  if (!token) return res.status(403).json({ message: 'No token provided.' })

  try {
    const verified = jwt.verify(token, SECRET_JWT_KEY)
    const userId = verified.id

    // Eliminar el marcador si pertenece al usuario autenticado
    const success = await MarkerRepository.deleteMarker(id, userId)

    if (!success) return res.status(404).json({ message: 'Marcador no encontrado o no tienes permiso para eliminarlo.' })

    res.status(200).json({ message: 'Marcador eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el marcador', error: error.message })
  }
})

app.get('/areas', async (req, res) => {
  try {
    const areas = await CrimeRepository.getAreas()
    res.json(areas)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener áreas', error: error.message })
  }
})

// Obtener todos los tipos de crimen
app.get('/tipos-crimen', async (req, res) => {
  try {
    const crimeTypes = await CrimeRepository.getCrimeTypes()
    res.json(crimeTypes)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tipos de crimen', error: error.message })
  }
})

// Crear un nuevo crimen
app.post('/crimenes', async (req, res) => {
  const { cantidad, id_area, id_tipo_crimen } = req.body
  try {
    const crimeId = await CrimeRepository.createCrime({ cantidad, id_area, id_tipo_crimen })
    res.status(201).json({ id: crimeId })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear crimen', error: error.message })
  }
})

// Eliminar un crimen
app.delete('/crimenes/:id', async (req, res) => {
  const { id } = req.params
  try {
    const success = await CrimeRepository.deleteCrime(id)
    if (!success) {
      return res.status(404).json({ message: 'Crimen no encontrado' })
    }
    res.status(200).json({ message: 'Crimen eliminado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar crimen', error: error.message })
  }
})

// Endpoint para crear múltiples crímenes a partir de un objeto de estadísticas de crimen
app.post('/crimenes/batch', async (req, res) => {
  const { id_area, roboVehCv, roboVehSv, roboCasaCv, roboCasaSv } = req.body
  // Array con los diferentes crímenes a insertar
  const crimes = [
    { cantidad: roboVehCv, id_area, id_tipo_crimen: 1 }, // Robo veh cv
    { cantidad: roboVehSv, id_area, id_tipo_crimen: 2 }, // Robo veh sv
    { cantidad: roboCasaCv, id_area, id_tipo_crimen: 3 }, // Robo casa cv
    { cantidad: roboCasaSv, id_area, id_tipo_crimen: 4 } // Robo casa sv
  ]

  try {
    // Crear cada crimen
    for (const crime of crimes) {
      if (crime.cantidad > -0.1) { // Evita insertar crímenes con cantidad 0
        await CrimeRepository.createCrime(crime)
      }
    }
    res.status(201).json({ message: 'Crímenes creados exitosamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear los crímenes', error: error.message })
  }
})

// Obtener las últimas estadísticas de crimen para un área específica
app.get('/crimenes/lastStats/:id_area', async (req, res) => {
  const { id_area } = req.params
  try {
    const lastStats = await CrimeRepository.getLastStats(id_area)
    res.json(lastStats)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las últimas estadísticas', error: error.message })
  }
})

app.get('/crimenes/stats/:id_area', async (req, res) => {
  const { id_area } = req.params
  try {
    const stats = await CrimeRepository.getLastTwelveStats(id_area)
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las estadísticas', error: error.message })
  }
})
app.get('/crimenes', async (req, res) => {
  try {
    const crimes = await CrimeRepository.getAllCrimes()
    res.json(crimes)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener crímenes', error: error.message })
  }
})

// Nueva ruta para obtener las estadísticas de crimen más recientes por área
app.get('/crimenes/stats', async (req, res) => {
  try {
    const stats = await CrimeRepository.getLatestCrimeStatsByArea()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas de crímenes', error: error.message })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
