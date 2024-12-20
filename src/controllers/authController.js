import jwt from 'jsonwebtoken'
import ENV from '../config/environment.js'
import UserRepository from '../repositories/userRepository.js'
import bcrypt from 'bcrypt'
import EmailHelper from '../helpers/emailHelper.js'

export const registerUser = async (req, res) => {
    console.log('Esto es registro')
    try {
        //Desestructuro el body
        const {name, email, password, phone} = req.body

        //Valido datos

        //Inserto usuario
        const repository = new UserRepository()
        const userObj = await repository.insert({
            name: name,
            email: email,
            password: await bcrypt.hash(password, 10),
            phone: phone
        })
        console.log(userObj)

        //Genero token de validacion
        const token = jwt.sign(
            {email: email},
            ENV.SECRET_KEY,
            {expiresIn: '1d'}
        )

        //Envio mail
        const url = `${ENV.API_URL}:${ENV.API_PORT}/auth/verify/${token}`
        const body = `Hola ${name}, para validar tu cuenta <a href='${url}'>hacé click acá</a>.`
        const emailObj = new EmailHelper()
        await emailObj.send(email, 'Valida tu cuenta', body)

        //Devuelvo respuesta
        res.sendStatus(201)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
} 

export const loginUser = async (req, res) => {
    try {
        console.log('Esto es un login')
        //Desetructuro el body
        const {email, password} = req.body

        //Valido datos

        //Chequeo usuario
        const repository = new UserRepository()
        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Verifica tu email o password')
        }

        const isPassCorrect = await bcrypt.compare(password, userObj.password)
        if (!isPassCorrect) {
            throw new Error('Verifica tu email o password')
        }

        if (!userObj.verified) {
            throw new Error('Por favor, valida tu cuenta')
        }
        
        //Genero token
        const user = {
            id: userObj.id,
            name: userObj.name,
            email: email
        }
        const token = jwt.sign(user, ENV.SECRET_KEY, {expiresIn: '1d'})

        //Devuelvo respuesta
        res.status(200).json({token: token, phone: userObj.phone})
    }
    catch(error) {
        console.error(error)
        res.status(401).json({error: error.message})
    }
}

export const verifyUser = async (req, res) => {
    try {
        const {token} = req.params
        console.log('Esto es el verify: ' + token)
        const payload = jwt.verify(token, ENV.SECRET_KEY)
        const email = payload.email

        const repository = new UserRepository()
        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Usuario no valido')
        }

        repository.verify(email)

        res.redirect(`${ENV.APP_URL}:${ENV.APP_PORT}/login`)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        console.log('Esto es forgotPassword')
        const {email} = req.body

        const repository = new UserRepository()
        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Usuario no valido')
        }

        const token = jwt.sign(
            {email: email},
            ENV.SECRET_KEY,
            {expiresIn: '1d'}
        )

        const url = `${ENV.APP_URL}:${ENV.APP_PORT}/cambiar-clave/${token}`
        const body = `Hola ${userObj.name}, para resetar tu clave <a href='${url}'>hace click aca</a>`
        const emailObj = new EmailHelper()
        await emailObj.send(email, 'Resetea tu clave', body)

        res.sendStatus(200)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}

export const resetPassword = async (req, res) => {
    try {
        console.log('Esto es un resetPassword')
        const {token, password, password2} = req.body

        const {email} = jwt.verify(token, ENV.SECRET_KEY)
        
        const repository = new UserRepository()
        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Usuario no valido')
        }
        if (password !== password2) {
            throw new Error('Las contraseñas no coinciden')
        }

        await repository.updatePassword(
            userObj.id,
            await bcrypt.hash(password, 10)
        )

        res.sendStatus(200)
    }
    catch(error) {
        console.error(error)
        res.status(500).json({error: error.message})
    }
}