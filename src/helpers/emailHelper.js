import nodemailer from 'nodemailer'
import ENV from '../config/environment.js'

class EmailHelper {
    constructor() {
        this.transport = nodemailer.createTransport({
            host: ENV.SMTP.HOST,
            port: ENV.SMTP.PORT,
            secure: true,
            auth: {
                user: ENV.SMTP.USER,
                pass: ENV.SMTP.PASS
            }
        })
    }

    async send(email, subject, body) {
        const options = {
            from: `"Tp Final" <${ENV.SMTP.USER}>`,
            to: email,
            subject: subject,
            html: body
        }
        this.transport.sendMail(
            options,
            (error, info) => {
                if (error) {
                    console.error('Error sending email: ', error)
                    throw new Error('Error sending email')
                }
                console.log('Email sent', info.response)
            }
        )
    }
}

export default EmailHelper