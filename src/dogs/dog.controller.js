import Dog from './dog.model.js';

export const saveDog = async (req, res) => {
    try {
        const { name, age, sex, breed, description } = req.body;

        // Extract file paths from req.files
        const images = req.files.map(file => file.path); // Or relative path if preferred, e.g., `/uploads/dogs/${file.filename}`

        // Create new Dog instance
        const dog = new Dog({
            name,
            age,
            sex,
            breed,
            description,
            images
        });

        // Save to database
        await dog.save();

        return res.status(201).json({
            message: "Perro registrado exitosamente",
            dog
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error al registrar el perro",
            error: error.message
        });
    }
}
