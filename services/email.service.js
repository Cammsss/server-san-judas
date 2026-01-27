import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, code) => {
    try {
        // Create transporter (Note: Configure with real credentials or env vars in production)
        // For testing, we might need to use a dummy account or user provided credentials.
        // I will use a placeholder config that the user needs to update.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or smtp.mailtrap.io for safe testing
            auth: {
                user: process.env.SMTP_USER || 'tu_correo@gmail.com',
                pass: process.env.SMTP_PASS || 'tu_contraseña_de_aplicacion'
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'no-reply@adoption.com',
            to: email,
            subject: 'Código de Verificación - Adopción de Perros',
            text: `Tu código de verificación es: ${code}. Este código expira en 1 minuto.`,
            html: `<h3>Tu código de verificación es: <b>${code}</b></h3><p>Este código expira en 1 minuto.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
        return true;

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false;
    }
}
