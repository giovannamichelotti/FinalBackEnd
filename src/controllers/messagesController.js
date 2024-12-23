import ValidationHelper from '../helpers/validationHelper.js'
import MessageRepository from '../repositories/messageRepository.js'
const repository = new MessageRepository()

export const get = async (req, res) => {
    try {
        console.log('Trayendo los mensajes')
        const {phone} = req.params
        const userPhone = req.user.phone
        const messages = await repository.get(userPhone, phone)
        const statusCode = messages.length ? 200 : 204
        res.status(statusCode).json({data: messages})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const insert = async (req, res) => {
    try {
        console.log('Insertando un mensaje')
        const userPhone = req.user.phone
        const {text, destination} = req.body

        //Valido datos
        ValidationHelper.verifyString('Teléfono', destination, 8)
        if (text === '') {
            throw new Error('El mensaje no puede estar vacio');
        }

        const message = await repository.insert(userPhone, destination, text)

        if (message) {
            return res.status(201).json({data: message})
        }
        res.status(500).json({error: 'No se pudo insertar el mensaje'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const remove = async (req, res) => {
    try {
        const {id} = req.params
        console.log('Eliminando el mensaje: ' + id)
        const userPhone = req.user.phone
        const messageDeleted = await repository.remove(userPhone, id)
        if (messageDeleted) {
            return res.sendStatus(200)
        }
        res.status(404).json({error: 'No se encontro el mensaje'})
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}