import crypto from 'crypto'
import { connection } from './db.js'

export class MarkerRepository {
  static async createMarker ({ lat, lng, iconType, userId }) {
    const id = crypto.randomUUID()

    // Inserta el marcador con el userId y el id generado
    await connection.execute(
      'INSERT INTO Markers (id, lat, lng, iconType, userId) VALUES (?, ?, ?, ?, ?)',
      [id, lat, lng, iconType, userId]
    )

    return id
  }

  static async getUserMarkers (userId) {
    // Selecciona todos los marcadores de un usuario
    const [rows] = await connection.execute('SELECT * FROM Markers WHERE userId = ?', [userId])
    return rows
  }

  static async deleteMarker (markerId, userId) {
    console.log('Eliminando marcador con ID:', markerId, 'y userId:', userId)
    // Elimina un marcador solo si pertenece al usuario
    const [result] = await connection.execute('DELETE FROM Markers WHERE id = ? AND userId = ?', [markerId, userId])
    return result.affectedRows > 0 // Retorna true si el marcador fue eliminado
  }
}
