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

  // Modificar el método getAllCrimes para incluir el id_area y id_tipo_crimen
  static async getAllCrimes () {
    const query = `
      SELECT crimenes.id, crimenes.cantidad, crimenes.fecha, 
             crimenes.id_area, crimenes.id_tipo_crimen,
             areas.area, tipos_crimen.crimen
      FROM crimenes
      INNER JOIN areas ON crimenes.id_area = areas.id
      INNER JOIN tipos_crimen ON crimenes.id_tipo_crimen = tipos_crimen.id
      ORDER BY crimenes.fecha DESC
    `
    const [crimes] = await connection.execute(query)
    return crimes
  }

  // Nuevo método para obtener las estadísticas de crimen más recientes por área
  static async getLatestCrimeStatsByArea () {
    const query = `
      SELECT c1.id_area, c1.id_tipo_crimen, c1.cantidad, c1.fecha
      FROM crimenes c1
      INNER JOIN (
        SELECT id_area, id_tipo_crimen, MAX(fecha) as max_fecha
        FROM crimenes
        GROUP BY id_area, id_tipo_crimen
      ) c2 ON c1.id_area = c2.id_area 
          AND c1.id_tipo_crimen = c2.id_tipo_crimen 
          AND c1.fecha = c2.max_fecha
      ORDER BY c1.id_area, c1.id_tipo_crimen
    `
    const [stats] = await connection.execute(query)
    // Reorganizar los datos para que sean más fáciles de usar en el frontend
    const organizedStats = stats.reduce((acc, stat) => {
      if (!acc[stat.id_area]) {
        acc[stat.id_area] = {}
      }
      acc[stat.id_area][stat.id_tipo_crimen] = {
        cantidad: stat.cantidad,
        fecha: stat.fecha
      }
      return acc
    }, {})
    return organizedStats
  }
}
