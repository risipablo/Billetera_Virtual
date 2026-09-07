
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


const YOUR_RESEND_EMAIL = 'serveraplicacion@gmail.com'; 

exports.EmailComment = async (req, res) => {
    
    
    try {
        const { name, message, reason } = req.body;

        
        if (!name || !message) {
            console.log(' Faltan campos requeridos');
            return res.status(400).json({ 
                error: 'Los campos nombre y mensaje son requeridos' 
            });
        }

        
        let subject = '';
        let emoji = '';
        
        switch (reason) {
            case 'sugerencia':
                subject = ' Sugerencia';
                emoji = '💡';
                break;
            case 'consulta':
                subject = ' Consulta';
                emoji = '📝';
                break;
            case 'queja':
                subject = 'Queja / Reclamo';
                emoji = '⚠️';
                break;
            case 'trabajo':
                subject = ' Propuesta Laboral';
                emoji = '💼';
                break;
            default:
                subject = ' Mensaje';
                emoji = '📬';
        }

        

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', 
            to: [YOUR_RESEND_EMAIL], 
            subject: `${emoji} ${subject} - De: ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">${emoji} ${subject}</h1>
                        
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #667eea; margin: 0 0 15px 0;">📋 Información del contacto</h3>
                            <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5; width: 120px;">👤 Nombre:</td>
                                    <td style="padding: 12px 15px;">${name}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #e0e0e0;">
                                    <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5;">🏷️ Tipo:</td>
                                    <td style="padding: 12px 15px;">
                                        <span style="background: #e0e7ff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                                            ${subject}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5;">📅 Fecha:</td>
                                    <td style="padding: 12px 15px;">${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #667eea; margin: 0 0 15px 0;">💬 Mensaje</h3>
                            <div style="background: white; padding: 20px; border-left: 4px solid #667eea; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                <p style="margin: 0; line-height: 1.8; white-space: pre-wrap;">${message}</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; background: #f1f3f4; border-radius: 8px; font-size: 12px; color: #666;">
                            <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto de tu portafolio.</p>
                            <p style="margin: 10px 0 0; font-size: 11px; color: #999;">
                                Enviado por: ${name}
                            </p>
                            <p style="margin: 5px 0 0; font-size: 11px; color: #999;">
                                Para responder, contacta al usuario a través del email proporcionado.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Error de Resend:', error);
            return res.status(400).json({ 
                error: 'Error al enviar el correo',
                details: error.message 
            });
        }

        console.log('Email enviado exitosamente a tu bandeja:', YOUR_RESEND_EMAIL);
        console.log('ID del mensaje:', data.id);
        
        res.status(200).json({ 
            message: 'Consulta enviada con éxito. ¡Gracias por contactarme!',
            messageId: data.id 
        });

    } catch (error) {
        console.error('Error en /send-email:', error);
        res.status(500).json({ 
            error: 'Error al enviar el correo',
            details: error.message 
        });
    }
};