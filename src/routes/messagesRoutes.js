import express from 'express'
import { get, insert, remove } from '../controllers/messagesController.js'

const messagesRoutes = express.Router()

messagesRoutes.get('/:phone', get)
messagesRoutes.post('/', insert)
messagesRoutes.delete('/:id', remove)

export default messagesRoutes