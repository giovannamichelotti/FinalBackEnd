import dotenv from 'dotenv'

dotenv.config()

const ENV = {
    API_URL: process.env.API_URL + (process.env.API_PORT ? ':' + process.env.API_PORT : ''),
    API_PORT: process.env.API_PORT,
    APP_URL: process.env.APP_URL + (process.env.APP_PORT ? ':' + process.env.APP_PORT : ''),
    SECRET_KEY: process.env.SECRET_KEY,
    DB: {
        HOST: process.env.DB_HOST,
        DATABASE: process.env.DB_BASE,
        USERNAME: process.env.DB_USER,
        PASSWORD: process.env.DB_PASS
    },
    MAILGUN: {
        KEY: process.env.MAILGUN_KEY,
        FROM: process.env.MAILGUN_FROM,
        DOMAIN: process.env.MAILGUN_DOMAIN
    }
}

export default ENV