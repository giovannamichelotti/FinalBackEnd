import jwt from 'jsonwebtoken'
import ENV from '../config/environment.js'

const authMiddleware = (req, res, next) => {
    console.log(`Procesando solicitud ${req.method} de ${req.originalUrl}`)
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            return res.status(401).json({message: "Falta el token de autorizacion"})
        }
        const accessToken = authHeader.split(' ')[1]
        console.log(accessToken)
        if (!accessToken) {
            return res.status(401).json({message: "Token vacio"})
        }
        //Verifico token
        const decodedPayload = jwt.verify(accessToken, ENV.SECRET_KEY)
        //Establezco usuario en el request
        req.user = decodedPayload
        next()
    }
    catch(error) {
        console.error(error)
        res.sendStatus(401)
    }
}

export default authMiddleware