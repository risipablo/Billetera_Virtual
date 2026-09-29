import { resend } from '../config/resend';
import { env } from '../config/env';

export const sendUserChangeName = async (
  email: string,
  oldUsername: string,
  newUserName: string
): Promise<void> => {
  if (!env.RESEND_API_KEY) {
    console.log('════════════════════════════════════════');
    console.log('[MODO DESARROLLO] Email simulado');
    console.log('════════════════════════════════════════');
    console.log('   Para:'.padEnd(15), email);
    console.log('   Asunto:'.padEnd(15), 'Nombre de usuario actualizado');
    console.log('   Cambio:'.padEnd(15), `${oldUsername} -> ${newUserName}`);
    console.log('   Fecha:'.padEnd(15), new Date().toLocaleString());
    console.log('════════════════════════════════════════\n');
    return;
  }

  try {
    await resend.emails.send({
      from: `"${env.APP_NAME}" <${env.FROM_EMAIL}>`,
      to: email,
      subject: `Nombre de usuario actualizado - ${env.APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Hola!</h2>
          <p>Tu nombre de usuario ha sido actualizado exitosamente.</p>

          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Cambio realizado:</strong></p>
            <p>De: <span style="color: #666;">${oldUsername}</span></p>
            <p>A: <span style="color: #2ecc71; font-weight: bold;">${newUserName}</span></p>
          </div>

          <p><strong>Nota importante:</strong> Por seguridad, tu sesión ha sido cerrada automáticamente.</p>

          <div style="margin-top: 25px; padding: 15px; background: #fff8e1; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              Si no realizaste este cambio, por favor contacta inmediatamente con nuestro soporte.
            </p>
          </div>
        </div>
      `
    });
    console.log('Email enviado a:', email);
  } catch (error) {
    console.error('Error enviando email:', error);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
): Promise<void> => {
  if (!env.RESEND_API_KEY) {
    console.log('════════════════════════════════════════');
    console.log('[MODO DESARROLLO] Email de reset simulado');
    console.log('════════════════════════════════════════');
    console.log('   Para:'.padEnd(15), email);
    console.log('   Link:'.padEnd(15), resetLink);
    console.log('   Expira:'.padEnd(15), '1 hora');
    console.log('════════════════════════════════════════\n');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `"${env.APP_NAME}" <${env.FROM_EMAIL}>`,
      to: email,
      subject: `Restablece tu contraseña - ${env.APP_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Restablecer contraseña</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #667eea; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              Restablecer contraseña
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Este enlace expira en <strong>1 hora</strong>.
          </p>

          <div style="margin-top: 25px; padding: 15px; background: #fff8e1; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('[Resend API Error]:', error);
      return;
    }

    console.log('Email de reset enviado a:', email);
    console.log('ID del mensaje:', data?.id);
  } catch (error) {
    console.error('Error enviando email de reset:', error);
  }
};