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

export const sendAdoptionConfirmationEmail = async (email, adoptionData) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || 'tu_correo@gmail.com',
                pass: process.env.SMTP_PASS || 'tu_contraseña_de_aplicacion'
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER || 'no-reply@adoption.com',
            to: email,
            subject: 'Confirmación de Registro para Adopción',
            text: `Hola ${adoptionData.fullName}, hemos recibido tu solicitud para adoptar a ${adoptionData.dogName}. Pronto nos pondremos en contacto contigo.`,
            html: `<h3>Confirmación de Registro para Adopción</h3>
                   <p>Hola <b>${adoptionData.fullName}</b>,</p>
                   <p>Hemos recibido correctamente tu solicitud para adoptar a <b>${adoptionData.dogName}</b>.</p>
                   <p>Nuestro equipo revisará tu perfil y se pondrá en contacto contigo pronto.</p>
                   <br/>
                   <p>¡Gracias por querer brindarle un hogar a un peludo!</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo de adopción enviado: %s', info.messageId);
        return true;

    } catch (error) {
        console.error('Error al enviar el correo de adopción:', error);
        return false;
    }
}
