const resend = require('../config/resend');


exports.sendUserChangeName = async (email, oldUsername, newuserName) => {
    
    if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === 'development') {
        console.log('════════════════════════════════════════');
        console.log('📧 [MODO DESARROLLO] Email simulado');
        console.log('════════════════════════════════════════');
        console.log('   Para:'.padEnd(15), email);
        console.log('   Asunto:'.padEnd(15), 'Nombre de usuario actualizado');
        console.log('   Cambio:'.padEnd(15), `${oldUsername} → ${newuserName}`);
        console.log('   Fecha:'.padEnd(15), new Date().toLocaleString());
        console.log('════════════════════════════════════════\n');
        return; // Salir sin enviar email real
    }

    
    try {
        await resend.emails.send({
            from: `${process.env.APP_NAME} <${process.env.FROM_EMAIL}>`,
            to: email,
            subject: `Nombre de usuario actualizado - ${process.env.APP_NAME}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">¡Hola!</h2>
                <p>Tu nombre de usuario ha sido actualizado exitosamente.</p>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Cambio realizado:</strong></p>
                    <p>De: <span style="color: #666;">${oldUsername}</span></p>
                    <p>A: <span style="color: #2ecc71; font-weight: bold;">${newuserName}</span></p>
                </div>
                
                <p><strong>Nota importante:</strong> Por seguridad, tu sesión ha sido cerrada automáticamente.</p>
                
                <div style="margin-top: 25px; padding: 15px; background: #fff8e1; border-radius: 5px;">
                    <p style="margin: 0; font-size: 14px; color: #856404;">
                        ⚠️ Si no realizaste este cambio, por favor contacta inmediatamente con nuestro soporte.
                    </p>
                </div>
            </div>
        `
        });
        console.log('✅ Email enviado a:', email);
    } catch (error) {
        console.error('❌ Error enviando email:', error);
    }
};