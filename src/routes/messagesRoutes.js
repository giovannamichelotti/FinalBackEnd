import express from 'express'
import { get, insert } from '../controllers/messagesController.js'

const messagesRoutes = express.Router()

messagesRoutes.get('/:phone', get)
messagesRoutes.post('/', insert)

export default messagesRoutes