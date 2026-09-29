
import { resend } from '../config/resend';
import { env } from '../config/env';
import type { Request, Response } from 'express';

export const sendPasswordEmail = async (
  email: string,
  resetToken: string,
  userName: string = 'Usuario'
): Promise<{ success: boolean; data: unknown }> => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

  if (!env.RESEND_API_KEY) {
    console.log('════════════════════════════════════════');
    console.log('[MODO DESARROLLO] Email de reset simulado');
    console.log('════════════════════════════════════════');
    console.log('   Para:'.padEnd(15), email);
    console.log('   Usuario:'.padEnd(15), userName);
    console.log('   Link:'.padEnd(15), resetUrl);
    console.log('   Expira:'.padEnd(15), '15 minutos');
    console.log('════════════════════════════════════════\n');
    return { success: true, data: null };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `"${env.APP_NAME}" <${env.FROM_EMAIL}>`,
      to: [email],
      subject: 'Recuperación de contraseña',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Recuperación de Contraseña</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                <p style="font-size: 16px;">Hola <strong>${userName}</strong>,</p>
                
                <p style="font-size: 16px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 14px 28px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-size: 16px;
                              font-weight: bold;
                              display: inline-block;
                              box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        Restablecer Contraseña
                    </a>
                </div>
                
                <p style="font-size: 14px; color: #666;">Este enlace expirará en <strong>15 minutos</strong>.</p>
                
                <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="font-size: 14px; margin: 0; word-break: break-all;">
                        <strong>O copia este enlace en tu navegador:</strong><br>
                        <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
                    </p>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 25px;">
                    Si no solicitaste este cambio, puedes ignorar este email o contactar a soporte si tienes dudas.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                    © ${new Date().getFullYear()} ${env.APP_NAME}. Todos los derechos reservados.
                </p>
            </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Error de Resend:', error);
      throw new Error(error.message);
    }

    console.log('Email enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
};


const YOUR_RESEND_EMAIL = 'serveraplicacion@gmail.com';

interface IContactBody {
  name?: string;
  message?: string;
  reason?: string;
}

export const EmailComment = async (req: Request, res: Response): Promise<void> => {
  const { name, message, reason } = req.body as IContactBody;

  if (!name || !message) {
    console.log('Faltan campos requeridos');
    res.status(400).json({
      error: 'Los campos nombre y mensaje son requeridos'
    });
    return;
  }

  let subject = '';

  switch (reason) {
    case 'sugerencia':
      subject = 'Sugerencia';
      break;
    case 'consulta':
      subject = 'Consulta';
      break;
    case 'queja':
      subject = 'Queja / Reclamo';
      break;
    case 'trabajo':
      subject = 'Propuesta Laboral';
      break;
    default:
      subject = 'Mensaje';
  }

  if (!env.RESEND_API_KEY) {
    console.log('════════════════════════════════════════');
    console.log('[MODO DESARROLLO] Email de contacto simulado');
    console.log('════════════════════════════════════════');
    console.log('   De:'.padEnd(15), name);
    console.log('   Tipo:'.padEnd(15), subject);
    console.log('   Mensaje:'.padEnd(15), message);
    console.log('════════════════════════════════════════\n');
    res.status(200).json({
      message: 'Consulta enviada con éxito. ¡Gracias por contactarme!',
      messageId: 'dev-mode'
    });
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [YOUR_RESEND_EMAIL],
      subject: `${subject} - De: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">${subject}</h1>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; margin: 0 0 15px 0;">Información del contacto</h3>
              <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden;">
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5; width: 120px;">Nombre:</td>
                  <td style="padding: 12px 15px;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5;">Tipo:</td>
                  <td style="padding: 12px 15px;">
                    <span style="background: #e0e7ff; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                      ${subject}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; font-weight: bold; background: #f5f5f5;">Fecha:</td>
                  <td style="padding: 12px 15px;">${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #667eea; margin: 0 0 15px 0;">Mensaje</h3>
              <div style="background: white; padding: 20px; border-left: 4px solid #667eea; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <p style="margin: 0; line-height: 1.8; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; background: #f1f3f4; border-radius: 8px; font-size: 12px; color: #666;">
              <p style="margin: 0;">Este mensaje fue enviado desde ${env.APP_NAME}.</p>
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
      res.status(400).json({
        error: 'Error al enviar el correo',
        details: error.message
      });
      return;
    }

    console.log('Email enviado exitosamente a tu bandeja:', YOUR_RESEND_EMAIL);
    console.log('ID del mensaje:', data?.id);

    res.status(200).json({
      message: 'Consulta enviada con éxito. ¡Gracias por contactarme!',
      messageId: data?.id
    });
  } catch (error) {
    console.error('Error en /send-email:', error);
    res.status(500).json({
      error: 'Error al enviar el correo',
      details: (error as Error).message
    });
  }
};