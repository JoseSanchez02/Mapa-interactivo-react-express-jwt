import mysql from 'mysql2/promise'

// Conexión a la base de datos
export const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123494',
  database: 'mapa_interactivo'
})
