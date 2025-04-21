const nodeMailer = require('nodemailer')
require('dotenv').config();


const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
})

const sendResetEmail = async (email,name,resetLink) => {
    const mailOptions = {
        from: '',
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
            <h1>Hola ${name}</h1>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetLink}">Restablecer contraseña</a>
            <p>Si no solicitaste esto, ignora este correo.</p>
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log("Correo enviado correctamente")
    } catch (error) {
        console.error('Error al enviar el correo', error)
        throw error
    }
}

module.exports = {sendResetEmail}