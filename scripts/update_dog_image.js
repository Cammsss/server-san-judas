import mongoose from 'mongoose';
import cloudinary from '../configs/cloudinary.js';
import Dog from '../src/dogs/dog.model.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

/**
 * Descarga una imagen desde una URL
 * @param {string} url - URL de la imagen
 * @returns {Promise<string>} - Ruta local del archivo descargado
 */
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const filename = `temp_image_${Date.now()}.jpg`;
        const filepath = path.join(process.cwd(), filename);
        
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            } else {
                fs.unlink(filepath, () => {});
                reject(new Error(`Error descargando imagen: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

/**
 * Actualiza la imagen de un perro específico
 * @param {string} dogName - Nombre del perro
 * @param {string} breedName - Raza del perro
 * @param {string} imageSource - Ruta local o URL de la nueva imagen
 */
async function updateDogImage(dogName, breedName, imageSource) {
    let imagePath = imageSource;
    let isTempFile = false;

    try {
        // Verificar si es una URL o archivo local
        if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
            console.log('Detectada URL de imagen, descargando...');
            imagePath = await downloadImage(imageSource);
            isTempFile = true;
            console.log(`Imagen descargada a: ${imagePath}`);
        } else {
            // Verificar que el archivo local existe
            if (!fs.existsSync(imageSource)) {
                console.error(`Error: El archivo no existe: ${imageSource}`);
                process.exit(1);
            }
        }

        // Buscar el perro por nombre y raza
        const dog = await Dog.findOne({ name: dogName, breedName: breedName });
        
        if (!dog) {
            console.error(`Error: No se encontró ningún perro con nombre "${dogName}" y raza "${breedName}"`);
            
            // Mostrar perros disponibles con esa raza
            const dogsByBreed = await Dog.find({ breedName: breedName });
            if (dogsByBreed.length > 0) {
                console.log(`\nPerros encontrados con raza "${breedName}":`);
                dogsByBreed.forEach(d => {
                    console.log(`  - ${d.name} (ID: ${d._id})`);
                });
            }
            
            process.exit(1);
        }

        console.log(`Perro encontrado: ${dog.name} (${dog.breedName})`);
        console.log(`Imágenes actuales: ${dog.images.length}`);

        // Subir nueva imagen a Cloudinary
        console.log('Subiendo nueva imagen a Cloudinary...');
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'dogs',
            resource_type: 'image'
        });

        const newImageUrl = result.secure_url;
        console.log(`Imagen subida: ${newImageUrl}`);

        // Reemplazar todas las imágenes con la nueva
        dog.images = [newImageUrl];
        
        await dog.save();
        
        console.log(`✅ Perro "${dogName}" actualizado exitosamente con nueva imagen`);
        console.log(`   URL: ${newImageUrl}`);
        
        // Eliminar archivo temporal si se creó
        if (isTempFile) {
            fs.unlinkSync(imagePath);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error actualizando imagen del perro:', error);
        
        // Eliminar archivo temporal si existe
        if (isTempFile && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        process.exit(1);
    }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length < 3) {
    console.log('Uso: node scripts/update_dog_image.js <nombre_perro> <raza> <ruta_o_url_imagen>');
    console.log('Ejemplo con archivo local: node scripts/update_dog_image.js "Firulais" "Golden Retriever" "C:/Users/tu_usuario/Downloads/perro.jpg"');
    console.log('Ejemplo con URL: node scripts/update_dog_image.js "Firulais" "Golden Retriever" "https://ejemplo.com/perro.jpg"');
    console.log('\nPerros disponibles en la base de datos:');
    listAllDogs();
} else {
    const [dogName, breedName, imageSource] = args;
    updateDogImage(dogName, breedName, imageSource);
}

async function listAllDogs() {
    try {
        const dogs = await Dog.find({});
        console.log('\nLista de perros en la base de datos:');
        dogs.forEach(dog => {
            console.log(`  - ${dog.name} | Raza: ${dog.breedName} | Categoría: ${dog.category} | Imágenes: ${dog.images.length}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error listando perros:', error);
        process.exit(1);
    }
}
