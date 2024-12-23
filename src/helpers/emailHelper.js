import formData from 'form-data'
import Mailgun from 'mailgun.js'
import ENV from '../config/environment.js'

class EmailHelper {
    static async send(email, subject, body) { 
        try {
            console.log({
                username: 'api',
                key: ENV.MAILGUN.KEY,
            })
            const mailgun = new Mailgun(formData)
            const mg = mailgun.client({
                username: 'api',
                key: ENV.MAILGUN.KEY,
            })

            const options = {
                from: `"Tp Final" <${ENV.MAILGUN.FROM}>`,
                to: email,
                subject: subject,
                html: body,
            }
            console.log(options)

            const response = await mg.messages.create(ENV.MAILGUN.DOMAIN, options)
            return response
        } catch (err) {
            console.log('Error sending email...', err.message)
            throw new Error(`Mailgun Error: ${err.message}`)
        }
    }
}

export default EmailHelper