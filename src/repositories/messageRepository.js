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
}

export default MessageRepository

/* Crear las clases de los repositorios:
messageRepository.js
contactRespotory.js

Ayudas:
Ir por partes:
1. crear clase sin código
2. exponer la clase (export)
3. Importar dependencias necesarias
4. Agregar el constructor sin código
5. Crear la propiedad pool para la conexión con la base de datos usando los datos del ENV. */