import Adoption from './adoption.model.js';
import { sendAdoptionConfirmationEmail } from '../../services/email.service.js';

export const saveAdoption = async (req, res) => {
    try {
        const { fullName, email, birthDate, phone, country, dogName } = req.body;

        // Guardar en MongoDB
        const adoption = new Adoption({ 
            fullName, 
            email, 
            birthDate, 
            phone, 
            country: country || 'Guatemala', 
            dogName 
        });
        
        await adoption.save();

        // Enviar correo de confirmación
        await sendAdoptionConfirmationEmail(email, { fullName, dogName });

        return res.status(201).json({ 
            success: true,
            message: "Registro de adopción guardado y correo enviado", 
            adoption 
        });
    } catch (error) {
        console.error('Error saving adoption:', error);
        return res.status(500).json({ 
            success: false,
            message: "Error al procesar el registro de adopción", 
            error: error.message 
        });
    }
}

export const getAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.find({});
        return res.json({ success: true, adoptions });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Error al obtener los registros de adopción", 
            error: error.message 
        });
    }
}
