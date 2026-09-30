import { Request, Response } from 'express';
import { resend } from '../config/resend';
import { env } from '../config/env';

const YOUR_RESEND_EMAIL = 's05230790@gmail.com';

interface IContactBody {
  name?: string;
  message?: string;
  reason?: string;
}

export const EmailComment = async (req: Request, res: Response): Promise<void> => {
  const { name, message, reason } = req.body as IContactBody;

  console.log('════════════════════════════════════════');
  console.log('[EmailComment] Iniciando envío de contacto');
  console.log('════════════════════════════════════════');
  console.log('  Body recibido:', { name, message, reason });

  if (!name || !message) {
    console.log('[EmailComment] Faltan campos requeridos');
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

  console.log('[EmailComment] Configuración de envío:');
  console.log('  RESEND_API_KEY presente:', !!env.RESEND_API_KEY);
  console.log('  RESEND_API_KEY (primeros 10):', env.RESEND_API_KEY?.substring(0, 10) + '...');
  console.log('  FROM (fijo):', 'onboarding@resend.dev');
  console.log('  TO:', YOUR_RESEND_EMAIL);
  console.log('  Subject:', `${subject} - De: ${name}`);
  console.log('  APP_NAME:', env.APP_NAME);
  console.log('  NODE_ENV:', env.NODE_ENV);

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
    console.log('[EmailComment] Enviando a Resend...');

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

    console.log('[EmailComment] Respuesta de Resend recibida');
    console.log('  data:', JSON.stringify(data, null, 2));
    console.log('  error:', JSON.stringify(error, null, 2));

    if (error) {
      console.error('════════════════════════════════════════');
      console.error('[EmailComment] ERROR DE RESEND');
      console.error('════════════════════════════════════════');
      console.error('  message:', error.message);
      console.error('  name:', error.name);
      console.error('  statusCode:', (error as { statusCode?: number }).statusCode);
      console.error('  Objeto completo:', JSON.stringify(error, null, 2));
      console.error('════════════════════════════════════════');

      res.status(400).json({
        error: 'Error al enviar el correo',
        details: error.message
      });
      return;
    }

    console.log('════════════════════════════════════════');
    console.log('[EmailComment] EMAIL ENVIADO EXITOSAMENTE');
    console.log('  Destinatario:', YOUR_RESEND_EMAIL);
    console.log('  ID del mensaje:', data?.id);
    console.log('════════════════════════════════════════');

    res.status(200).json({
      message: 'Consulta enviada con éxito. ¡Gracias por contactarme!',
      messageId: data?.id
    });
  } catch (error) {
    console.error('════════════════════════════════════════');
    console.error('[EmailComment] EXCEPCIÓN CAPTURADA');
    console.error('════════════════════════════════════════');
    console.error('  Tipo:', (error as Error).constructor?.name);
    console.error('  Message:', (error as Error).message);
    console.error('  Stack:', (error as Error).stack);
    console.error('  Objeto completo:', JSON.stringify(error, null, 2));
    console.error('════════════════════════════════════════');

    res.status(500).json({
      error: 'Error al enviar el correo',
      details: (error as Error).message
    });
  }
};