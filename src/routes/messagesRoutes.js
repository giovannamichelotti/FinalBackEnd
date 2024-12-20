import express from 'express'
import { getAll, insert, remove } from '../controllers/messagesController.js'

const messagesRoutes = express.Router()

messagesRoutes.get('/:phone', getAll)
messagesRoutes.post('/', insert)
messagesRoutes.delete('/:id', remove)

export default messagesRoutes