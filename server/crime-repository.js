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

  // Obtener las últimas estadísticas para un área específica
  static async getLastStats (id_area) {
    try {
      const [rows] = await connection.query(`
        SELECT 
          c.fecha,
          MAX(CASE WHEN tc.id = 1 THEN c.cantidad END) as roboVehCv,
          MAX(CASE WHEN tc.id = 2 THEN c.cantidad END) as roboVehSv,
          MAX(CASE WHEN tc.id = 3 THEN c.cantidad END) as roboCasaCv,
          MAX(CASE WHEN tc.id = 4 THEN c.cantidad END) as roboCasaSv
        FROM crimenes c
        JOIN tipos_crimen tc ON c.id_tipo_crimen = tc.id
        WHERE c.id_area = ?
        GROUP BY c.fecha
        ORDER BY c.fecha DESC
        LIMIT 1
      `, [id_area])

      if (rows.length > 0) {
        return {
          fecha: rows[0].fecha,
          stats: {
            id_area: parseInt(id_area),
            roboVehCv: rows[0].roboVehCv || '',
            roboVehSv: rows[0].roboVehSv || '',
            roboCasaCv: rows[0].roboCasaCv || '',
            roboCasaSv: rows[0].roboCasaSv || ''
          }
        }
      }
      return null
    } catch (error) {
      console.error('Error en getLastStats:', error)
      throw error
    }
  }

  static async getLastTwelveStats (id_area) {
    try {
      const [rows] = await connection.query(`
        SELECT 
          c.fecha,
          MAX(CASE WHEN tc.id = 1 THEN c.cantidad END) as roboVehCv,
          MAX(CASE WHEN tc.id = 2 THEN c.cantidad END) as roboVehSv,
          MAX(CASE WHEN tc.id = 3 THEN c.cantidad END) as roboCasaCv,
          MAX(CASE WHEN tc.id = 4 THEN c.cantidad END) as roboCasaSv
        FROM crimenes c
        JOIN tipos_crimen tc ON c.id_tipo_crimen = tc.id
        WHERE c.id_area = ?
        GROUP BY c.fecha
        ORDER BY c.fecha DESC
        LIMIT 12
      `, [id_area])

      return rows.map(row => ({
        fecha: row.fecha,
        roboVehCv: row.roboVehCv || 0,
        roboVehSv: row.roboVehSv || 0,
        roboCasaCv: row.roboCasaCv || 0,
        roboCasaSv: row.roboCasaSv || 0
      }))
    } catch (error) {
      console.error('Error en getLastTwelveStats:', error)
      throw error
    }
  }
}
