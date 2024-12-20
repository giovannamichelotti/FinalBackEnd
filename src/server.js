import express from 'express'
import cors from 'cors'
import ENV from './config/environment.js'
import authRoutes from './routes/authRoutes.js'
import contactsRoutes from './routes/contactsRoutes.js'
import messagesRoutes from './routes/messagesRoutes.js'
import authMiddleware from './middlewares/authMiddleware.js'

const PORT = ENV.API_PORT

const app = express()

app.use(express.json())

const corsOptions = {
    origin: `${ENV.APP_URL}:${ENV.APP_PORT}`,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTION'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

// Defino rutas
app.use('/auth', authRoutes)
app.use('/contacts', authMiddleware, contactsRoutes)
app.use('/messages', authMiddleware, messagesRoutes)

app.listen(PORT, () => {
    console.log(`servidor iniciado en ${ENV.API_URL}:${PORT}`)
})