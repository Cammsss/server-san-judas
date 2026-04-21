import Dog from './dog.model.js';
import cloudinary from '../../configs/cloudinary.js';

export const saveDog = async (req, res) => {
    try {
        const { name, age, breedName, history, category } = req.body;
        
        let imageUrl = "";

        // Si hay una imagen subida temporalmente por multer
        if (req.files && req.files.length > 0) {
            // Subimos a Cloudinary dentro de un folder llamado 'dogs'
            const result = await cloudinary.uploader.upload(req.files[0].path, {
                folder: 'dogs'
            });
            imageUrl = result.secure_url; // Usamos la URL segura de Cloudinary
        }

        const dog = new Dog({ 
            name, 
            age, 
            breedName, 
            history, 
            category, 
            image: imageUrl 
        });
        await dog.save();

        return res.status(201).json({ message: "Perro registrado exitosamente", dog });
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar el perro", error: error.message });
    }
}

export const getDogs = async (req, res) => {
    try {
        const dogs = await Dog.find({});
        return res.json(dogs);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener perros", error: error.message });
    }
}
