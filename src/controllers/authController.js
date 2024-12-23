import jwt from 'jsonwebtoken'
import ENV from '../config/environment.js'
import UserRepository from '../repositories/userRepository.js'
import bcrypt from 'bcrypt'
import EmailHelper from '../helpers/emailHelper.js'
import ValidationHelper from '../helpers/validationHelper.js'
const repository = new UserRepository()

export const registerUser = async (req, res) => {
    console.log('Esto es registro')
    try {
        //Desestructuro el body
        const {name, email, password, phone} = req.body

        //Valido datos
        ValidationHelper.verifyString('Nombre', name, 4)
        ValidationHelper.isNumber('Teléfono', phone)
        ValidationHelper.isEmail('Email', email)
        ValidationHelper.verifyMinLength('Telefóno', phone, 8)
        ValidationHelper.verifyString('Clave', password, 8)

        //Inserto usuario
        const userObj = await repository.insert({
            name: ValidationHelper.clearString(name),
            email: ValidationHelper.clearEmail(email),
            password: await bcrypt.hash(password, 10),
            phone: ValidationHelper.clearString(phone)
        })

        //Genero token de validacion
        const token = jwt.sign(
            {email: email},
            ENV.SECRET_KEY,
            {expiresIn: '1d'}
        )

        //Envio mail
        const url = `${ENV.API_URL}/auth/verify/${token}`
        const body = `Hola ${name}, para validar tu cuenta <a href='${url}'>hacé click acá</a>.`
        await EmailHelper.send(email, 'Valida tu cuenta', body)

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
        ValidationHelper.isEmail('Email', email)
        ValidationHelper.verifyString('Clave', password, 8)

        //Chequeo usuario
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
            email: email,
            phone: userObj.phone
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
        const {email} = jwt.verify(token, ENV.SECRET_KEY)

        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Usuario no valido')
        }

        repository.verify(email)

        res.redirect(`${ENV.APP_URL}/login`)
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

        ValidationHelper.isEmail('Email', email)

        const userObj = await repository.getByEmail(email)
        if (!userObj) {
            throw new Error('Usuario no valido')
        }

        const token = jwt.sign(
            {email: email},
            ENV.SECRET_KEY,
            {expiresIn: '1d'}
        )

        const url = `${ENV.APP_URL}/change-password/${token}`
        const body = `Hola ${userObj.name}, para resetar tu clave <a href='${url}'>hace click aca</a>`
        await EmailHelper.send(email, 'Resetea tu clave', body)

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

        ValidationHelper.isEmail('Email', email)
        ValidationHelper.verifyString('Clave', password, 8)
        
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