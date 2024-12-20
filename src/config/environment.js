import dotenv from 'dotenv'

dotenv.config()

const ENV = {
    API_URL: process.env.API_URL,
    API_PORT: process.env.API_PORT,
    APP_URL: process.env.APP_URL,
    APP_PORT: process.env.APP_PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    DB: {
        HOST: process.env.DB_HOST,
        DATABASE: process.env.DB_BASE,
        USERNAME: process.env.DB_USER,
        PASSWORD: process.env.DB_PASS
    },
    SMTP: {
        HOST: process.env.SMTP_HOST,
        PORT: process.env.SMTP_PORT,
        USER: process.env.SMTP_USER,
        PASS: process.env.SMTP_PASS
    }
}

export default ENV