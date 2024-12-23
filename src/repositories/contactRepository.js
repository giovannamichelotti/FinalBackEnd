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

    async get(userId) {
        try {
            const [contacts] = await this.pool.query(
                'select * from contacts where owner_id = ?',
                [userId]
            )
            return contacts
        }
        catch(error) {
            console.error('Error al obtener contactos:', error.message)
            throw new Error('Error al obtener contactos')
        }
    }

    async getById(userId, id) {
        try {
            const [contacts] = await this.pool.query(
                'select * from contacts where owner_id = ? and id = ?',
                [userId, id]
            )
            return contacts[0] || null
        }
        catch(error) {
            console.error('Error al obtener contacto:', error.message)
            throw new Error('Error al obtener contacto')
        }
    }

    async insert(userId, contact) {
        try {
            const {name, phone, email} = contact
            const [result] = await this.pool.query(
                'insert into contacts (owner_id, name, phone, email, image) values (?, ?, ?, ?, ?)',
                [
                    userId, 
                    name, 
                    phone, 
                    email,
                    'https://robohash.org/user-' + Math.random()
                ]
            )
            contact.id = result.insertId
            return contact 
        }
        catch(error) {
            console.error(`Error al insertar el contacto: ${error.message} (${error.code})`)
            let msg = ''
            if (error.code === 'ER_DUP_ENTRY') {
                msg = `: el contacto ya existe`
            }
            throw new Error('No se pudo insertar el contacto' + msg)
        }
    }

    async update(userId, id, contact) {
        try {
            const existingContact = await this.getById(userId, id)
            if (!existingContact) {
                throw new Error('Contacto no encontrado')
            }
            const {name, phone, email} = contact
            await this.pool.query(
                'update contacts set name = ?, phone = ?, email = ? where id = ? and owner_id = ?',
                [name, phone, email, id, userId]
            )
            return true
        }
        catch(error) {
            console.error(`Error al actualizar el contacto: ${error.message} (${error.code})`)
            let msg = ''
            if (error.code === 'ER_DUP_ENTRY') {
                msg = `: el contacto ya existe`
            }
            throw new Error('No se pudo actualizar el contacto' + msg)
        }
    }

    async remove(userId, id) {
        try {
            const existingContact = await this.getById(userId, id)
            if (!existingContact) {
                throw new Error('Contacto no encontrado')
            }
            await this.pool.query(
                'delete from contacts where id = ? and owner_id = ?',
                [id, userId]
            )
            return true
        }
        catch(error) {
            console.error('Error al eliminar contacto:', error.message)
            throw new Error('Error al eliminar contacto')
        }
    }
}

export default ContactRepository