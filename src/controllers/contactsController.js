import ValidationHelper from '../helpers/validationHelper.js'
import ContactRepository from '../repositories/contactRepository.js'
const repository = new ContactRepository()

export const get = async (req, res) => {
    try {
        console.log('Trayendo todos los contactos')
        const userId = req.user.id
        const contacts = await repository.get(userId)
        const statusCode = contacts.length ? 200 : 204
        res.status(statusCode).json({data: contacts})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const getById = async (req, res) => {
    try {
        const {id} = req.params
        console.log('Obteniendo contacto ' + id)
        const userId = req.user.id
        const contact = await repository.getById(userId, id)
        if (contact) {
            return res.status(302).json({data: contact})
        }
        res.status(404).json({error: 'Contacto no encontrado'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const insert = async (req, res) => {
    try {
        console.log('Insertando un contacto')
        const userId = req.user.id
        const {name, phone, email} = req.body

        //Valido datos
        ValidationHelper.verifyString('Nombre', name, 4)
        ValidationHelper.isNumber('Teléfono', phone)
        ValidationHelper.isEmail('Email', email)
        ValidationHelper.verifyMinLength('Telefóno', phone, 8)

        const contact = await repository.insert(
            userId, {
                name: ValidationHelper.clearString(name),
                phone: ValidationHelper.clearString(phone),
                email: ValidationHelper.clearEmail(email)
            }
        )

        if (contact) {
            return res.status(200).json({data: contact})
        }
        res.status(500).json({error: 'No se pudo insertar el usuario'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const update = async (req, res) => {
    try {
        const {id} = req.params
        console.log('Actualizando el contacto: ' + id)
        const userId = req.user.id
        const {name, phone, email} = req.body

        //Valido datos
        ValidationHelper.verifyString('Nombre', name, 4)
        ValidationHelper.isNumber('Teléfono', phone)
        ValidationHelper.isEmail('Email', email)
        ValidationHelper.verifyMinLength('Telefóno', phone, 8)

        const contactUpdated = await repository.update(
            userId,
            id, {
                name: ValidationHelper.clearString(name),
                phone: ValidationHelper.clearString(phone),
                email: ValidationHelper.clearEmail(email)
            }
        )
        if (contactUpdated) {
            return res.status(200).json({message: 'Contacto actualizado'})
        }
        res.status(304).json({error: 'No se actualizaron datos'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const remove = async (req, res) => {
    try {
        const {id} = req.params
        console.log('Eliminando el contacto: ' + id)
        const userId = req.user.id
        const contactDeleted = await repository.remove(userId, id)
        if (contactDeleted) {
            return res.sendStatus(200)
        }
        res.status(404).json({error: 'No se encontro el contacto'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}