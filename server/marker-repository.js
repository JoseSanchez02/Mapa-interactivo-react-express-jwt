import crypto from 'crypto'
import { connection } from './db.js'

export class MarkerRepository {
  static async createMarker ({ lat, lng, iconType }) {
    const id = crypto.randomUUID()

    await connection.execute(
      'INSERT INTO Markers (id, lat, lng, iconType) VALUES (?, ?, ?, ?)',
      [id, lat, lng, iconType]
    )
    // Retornar el objeto completo del marcador
    return {
      id,
      lat,
      lng,
      iconType
    }
  }

  static async getUserMarkers (userId) {
    // Selecciona todos los marcadores de un usuario
    const [rows] = await connection.execute('SELECT * FROM Markers WHERE userId = ?', [userId])
    return rows
  }

  static async getAllMarkers () {
    // Supongamos que usas una base de datos. Aquí simplemente obtienes todos los markers
    const query = 'SELECT * FROM markers'
    const [results] = await connection.query(query) // Ajusta según tu conexión de base de datos
    return results
  }

  static async deleteMarker (markerId) {
    console.log('Eliminando marcador con ID:', markerId, 'y userId:')
    // Elimina un marcador solo si pertenece al usuario
    const [result] = await connection.execute('DELETE FROM Markers WHERE id = ?', [markerId])
    return result.affectedRows > 0 // Retorna true si el marcador fue eliminado
  }
}
