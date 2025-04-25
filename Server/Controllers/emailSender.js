const nodeMailer = require('nodemailer')
require('dotenv').config();


const transporter = nodeMailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const sendResetEmail = async (email,name,resetLink) => {
    const mailOptions = {
        from: "Soporte Billetera",
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #4CAF50;">Hola ${name},</h2>
                <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente botón para continuar:</p>
                <a href="${resetLink}" 
                style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    Restablecer contraseña
                </a>
                <p style="margin-top: 20px;">Si no solicitaste esto, puedes ignorar este correo.</p>
                <p style="font-size: 12px; color: #888;">Billetera Virtual - Seguridad de tu cuenta</p>
            </div>
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