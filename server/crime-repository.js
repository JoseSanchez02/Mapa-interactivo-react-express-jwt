import { connection } from './db.js'

export class CrimeRepository {
  // Obtener todas las áreas
  static async getAreas () {
    const [areas] = await connection.execute('SELECT * FROM areas')
    return areas
  }

  // Obtener todos los tipos de crimen
  static async getCrimeTypes () {
    const [crimeTypes] = await connection.execute('SELECT * FROM tipos_crimen')
    return crimeTypes
  }

  // Crear un nuevo crimen
  static async createCrime ({ cantidad, id_area, id_tipo_crimen }) {
    const query = `
      INSERT INTO crimenes (cantidad, id_area, id_tipo_crimen)
      VALUES (?, ?, ?)
    `
    const [result] = await connection.execute(query, [cantidad, id_area, id_tipo_crimen])
    return result.insertId
  }

  // Obtener todos los crímenes
  static async getAllCrimes () {
    const query = `
    SELECT crimenes.id, crimenes.cantidad, crimenes.fecha, areas.area, tipos_crimen.crimen
    FROM crimenes
    INNER JOIN areas ON crimenes.id_area = areas.id
    INNER JOIN tipos_crimen ON crimenes.id_tipo_crimen = tipos_crimen.id
    ORDER BY crimenes.fecha DESC
  `
    const [crimes] = await connection.execute(query)
    return crimes
  }

  // Eliminar un crimen por id
  static async deleteCrime (id) {
    const query = 'DELETE FROM crimenes WHERE id = ?'
    const [result] = await connection.execute(query, [id])
    return result.affectedRows > 0
  }
}
