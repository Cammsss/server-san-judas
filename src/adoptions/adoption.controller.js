import Adoption from './adoption.model.js';
import User from '../users/user.model.js';

export const saveAdoption = async (req, res) => {
    try {
        const { fullName, email, birthDate, phone, country, dogName } = req.body;

        // Buscar al usuario que inició sesión
        const loggedInUser = await User.findById(req.uid);
        
        // Verificar si el correo del formulario es el mismo con el que se registró
        if (!loggedInUser || loggedInUser.email !== email) {
            return res.status(400).json({
                success: false,
                message: "El correo proporcionado debe ser el mismo con el que te registraste en la cuenta. Solicitud denegada."
            });
        }

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

        return res.status(201).json({ 
            success: true,
            message: "Solicitud de adopción recibida con éxito.", 
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
