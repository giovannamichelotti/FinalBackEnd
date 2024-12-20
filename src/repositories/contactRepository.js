import mysql from 'mysql2/promise'
import ENV from '../config/environment.js'

class ContactRepository {
    constructor() {
        this.pool = mysql.createPool({
            host: ENV.DB.HOST,
            user: ENV.DB.USERNAME,
            password: ENV.DB.PASSWORD,
            database: ENV.DB.DATABASE
        })
    }
}

export default ContactRepository