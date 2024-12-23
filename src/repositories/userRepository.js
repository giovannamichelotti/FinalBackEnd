import mysql from 'mysql2/promise'
import ENV from '../config/environment.js'
import ValidationHelper from '../helpers/validationHelper.js'

class UserRepository {
    constructor() {
        this.pool = mysql.createPool({
            host: ENV.DB.HOST,
            user: ENV.DB.USERNAME,
            password: ENV.DB.PASSWORD,
            database: ENV.DB.DATABASE
        })
    }

    async getByEmail(email) {
        email = ValidationHelper.clearEmail(email)
        try {
            const [users] = await this.pool.query('select * from users where email = ?', [email])
            return users[0] || null
        }
        catch(error) {
            console.error(`Error al obtener al usario por mail: ${error.message}`)
            throw new Error('No se pudo obtener al usuario')
        }
    }

    async insert(user) {
        try {
            const {name, email, password, phone} = user
            console.log(user)
            const [result] = await this.pool.query( 
                'insert into users (name, email, password, phone, verified, token) values (?, ?, ?, ?, ?, ?)', 
                [
                    name.trim(),
                    email.trim(),
                    password.trim(),
                    phone,
                    false,
                    ''
                ]
            )
            user.id = result.insertId
            return user
        }
        catch(error) {
            console.error(`Error al insertar el usuario: ${error.message} (${error.code})`)
            let msg = ''
            if (error.code === 'ER_DUP_ENTRY') {
                msg = `: el email ${user.email.trim()} ya esta registrado`
            }
            throw new Error('No se pudo insertar el usuario' + msg)
        }
    }

    async verify(email) {
        try {
            await this.pool.query(
                'UPDATE users set verified = ? where email = ?',
                [true, email]
            )
            return true
        }
        catch(error) {
            console.error('Error al validar el usuario', error)
            throw new Error('No se pudo validar el usuario')
        }
    }

    async updatePassword(id, password) {
        try {
            await this.pool.query(
                'UPDATE users set password = ? where id = ?',
                [password, id]
            )
            return true
        }
        catch(error) {
            console.error('Error al actualizar clave', error)
            throw new Error('No se pudo cambiar la clave')
        }
    }
}

export default UserRepository