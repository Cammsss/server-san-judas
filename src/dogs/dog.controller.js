import Dog from './dog.model.js';
import cloudinary from '../../configs/cloudinary.js';

export const saveDog = async (req, res) => {
    try {
        const { 
            name, 
            age, 
            breedName, 
            history, 
            category,
            alimentacion,
            cuidadosBasicos,
            comportamiento,
            juegosFavoritos,
            recomendacionesPostAdopcion
        } = req.body;
        
        let imageUrls = [];
        let videoUrls = [];

        // Si hay archivos subidos temporalmente por multer
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Determinar si es video por el mimetype
                const isVideo = file.mimetype.startsWith('video/');
                const folder = isVideo ? 'dog_videos' : 'dogs';
                
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folder,
                    resource_type: isVideo ? 'video' : 'image'
                });
                
                const url = result.secure_url;
                
                // Evitar duplicados de imágenes
                if (isVideo) {
                    if (!videoUrls.includes(url)) {
                        videoUrls.push(url);
                    }
                } else {
                    if (!imageUrls.includes(url)) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        const dog = new Dog({ 
            name, 
            age, 
            breedName, 
            history, 
            category, 
            images: imageUrls,
            videos: videoUrls,
            alimentacion,
            cuidadosBasicos,
            comportamiento,
            juegosFavoritos,
            recomendacionesPostAdopcion
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

export const getDogById = async (req, res) => {
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id);
        
        if (!dog) {
            return res.status(404).json({ message: "Perro no encontrado" });
        }
        
        return res.json(dog);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el perro", error: error.message });
    }
}

export const updateDog = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, 
            age, 
            breedName, 
            history, 
            category,
            alimentacion,
            cuidadosBasicos,
            comportamiento,
            juegosFavoritos,
            recomendacionesPostAdopcion,
            existingImages,
            existingVideos
        } = req.body;
        
        let imageUrls = existingImages ? JSON.parse(existingImages) : [];
        let videoUrls = existingVideos ? JSON.parse(existingVideos) : [];

        // Si hay archivos subidos temporalmente por multer
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const isVideo = file.mimetype.startsWith('video/');
                const folder = isVideo ? 'dog_videos' : 'dogs';
                
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folder,
                    resource_type: isVideo ? 'video' : 'image'
                });
                
                const url = result.secure_url;
                
                // Evitar duplicados
                if (isVideo) {
                    if (!videoUrls.includes(url)) {
                        videoUrls.push(url);
                    }
                } else {
                    if (!imageUrls.includes(url)) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        const updateData = {
            name, 
            age, 
            breedName, 
            history, 
            category,
            images: imageUrls,
            videos: videoUrls,
            alimentacion,
            cuidadosBasicos,
            comportamiento,
            juegosFavoritos,
            recomendacionesPostAdopcion
        };

        const dog = await Dog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: false }
        );
        
        if (!dog) {
            return res.status(404).json({ message: "Perro no encontrado" });
        }
        
        return res.json({ message: "Perro actualizado exitosamente", dog });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el perro", error: error.message });
    }
}

export const patchDog = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        let imageUrls = updates.existingImages ? JSON.parse(updates.existingImages) : [];
        let videoUrls = updates.existingVideos ? JSON.parse(updates.existingVideos) : [];

        // Si hay archivos subidos temporalmente por multer
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const isVideo = file.mimetype.startsWith('video/');
                const folder = isVideo ? 'dog_videos' : 'dogs';
                
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: folder,
                    resource_type: isVideo ? 'video' : 'image'
                });
                
                const url = result.secure_url;
                
                // Evitar duplicados
                if (isVideo) {
                    if (!videoUrls.includes(url)) {
                        videoUrls.push(url);
                    }
                } else {
                    if (!imageUrls.includes(url)) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        // Eliminar campos temporales del updates
        delete updates.existingImages;
        delete updates.existingVideos;
        
        // Agregar arrays actualizados
        updates.images = imageUrls;
        updates.videos = videoUrls;

        const dog = await Dog.findByIdAndUpdate(
            id, 
            updates, 
            { new: true, runValidators: false }
        );
        
        if (!dog) {
            return res.status(404).json({ message: "Perro no encontrado" });
        }
        
        return res.json({ message: "Perro actualizado parcialmente", dog });
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el perro", error: error.message });
    }
}
