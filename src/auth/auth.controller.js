import User from '../users/user.model.js';
import { sendVerificationEmail } from '../../services/email.service.js';
import { generarJWT } from '../../helpers/JWT-generate.js';

export const initVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "El email es obligatorio" });
        }

        // Generate 5-digit code
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const verificationExpires = new Date(Date.now() + 60 * 1000); // 1 minute from now

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new temporary user
            user = new User({ email, verificationCode: code, verificationExpires });
        } else {
            // Update existing user
            user.verificationCode = code;
            user.verificationExpires = verificationExpires;
            user.isVerified = false; // Reset verification if requesting new code
        }

        await user.save();

        const emailSent = await sendVerificationEmail(email, code);

        if (!emailSent) {
            return res.status(500).json({ message: "Error al enviar el correo de verificación" });
        }

        return res.status(200).json({ message: "Código de verificación enviado" });

    } catch (error) {
        return res.status(500).json({
            message: "Error al iniciar verificación",
            error: error.message
        });
    }
}

export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email y código son obligatorios" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        if (new Date() > user.verificationExpires) {
            return res.status(400).json({ message: "El código ha expirado" });
        }

        // Verification success
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpires = null;
        await user.save();

        // Generate JWT implementation might rely on previously deleted helpers. 
        // I noticed 'JWT-generate.js' in helpers earlier, need to ensure it wasn't deleted or if I need to use it.
        // Assuming I should return a token for session if the requirement implies login after verification.
        // The prompt says "Al iniciar sesión...". 
        // If this is for login, we should probably issue a token.

        // I will re-check if JWT-generate.js exists.

        return res.status(200).json({
            message: "Verificación exitosa",
            // token: ... (if needed)
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al verificar código",
            error: error.message
        });
    }
}
