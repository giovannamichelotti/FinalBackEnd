import express from 'express'
import { getAll, getById, insert, update, remove } from '../controllers/contactsController.js'

const contactsRoutes = express.Router()

// Defino rutas de contacts con el responsable de procesar cada request
contactsRoutes.get('/', getAll)
contactsRoutes.get('/:id', getById)
contactsRoutes.post('/', insert)
contactsRoutes.put('/:id', update)
contactsRoutes.delete('/:id', remove)

export default contactsRoutes