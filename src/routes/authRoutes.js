import express from 'express'
import { registerUser, loginUser, verifyUser, forgotPassword, resetPassword } from '../controllers/authController.js'

const authRoutes = express.Router()

// Defino rutas de auth con el responsable de procesar cada request
authRoutes.post('/register', registerUser)
authRoutes.post('/login', loginUser)
authRoutes.get('/verify/:token', verifyUser)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.put('/reset-password', resetPassword)

export default authRoutes