import mysql from 'mysql2/promise'
import ENV from '../config/environment.js'

class MessageRepository {
    constructor() {
        this.pool = mysql.createPool({
            host: ENV.DB.HOST,
            user: ENV.DB.USERNAME,
            password: ENV.DB.PASSWORD,
            database: ENV.DB.DATABASE
        })
    }

    async get(from, to) {
        console.log(`select * from messages where (origin_phone = '${from}' and destination_phone = '${to}') or (destination_phone = '${from}' and origin_phone = '${to}')`)
        try {
            const [messages] = await this.pool.query(
                'select * from messages where (origin_phone = ? and destination_phone = ?) or (destination_phone = ? and origin_phone = ?)',
                [from, to, from, to]
            )
            return messages
        }
        catch(error) {
            console.error('Error al obtener mensajes:', error.message)
            throw new Error('Error al obtener mensajes')
        }
    }

    async insert(from, to, message) {
        try {
            const [result] = await this.pool.query(
                'insert into messages (origin_phone, destination_phone, message) values (?, ?, ?)',
                [from, to, message]
            )
            return result.insertId
        }
        catch(error) {
            console.error(`Error al insertar mensaje: ${error.message} (${error.code})`)
            throw new Error('No se pudo insertar mensaje')
        }
    }
}

export default MessageRepository