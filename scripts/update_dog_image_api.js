import fs from 'fs';
import https from 'https';
import path from 'path';
import { Readable } from 'stream';

const API_BASE = 'https://aloa-server-sanjudas.vercel.app/api';

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
 * Busca un perro por nombre y raza
 * @param {string} dogName - Nombre del perro
 * @param {string} breedName - Raza del perro
 * @returns {Promise<Object>} - Datos del perro
 */
async function findDog(dogName, breedName) {
    try {
        const response = await axios.get(`${API_BASE}/dogs`);
        const dogs = response.data;
        
        const dog = dogs.find(d => 
            d.name.toLowerCase() === dogName.toLowerCase() && 
            d.breedName.toLowerCase() === breedName.toLowerCase()
        );
        
        return dog;
    } catch (error) {
        console.error('Error buscando perro:', error.message);
        throw error;
    }
}

/**
 * Actualiza la imagen de un perro usando la API
 * @param {string} dogId - ID del perro
 * @param {string} imagePath - Ruta local de la imagen
 * @param {Object} dogData - Datos actuales del perro
 */
async function updateDogImageAPI(dogId, imagePath, dogData) {
    try {
        const formData = new FormData();
        
        // Agregar la nueva imagen
        formData.append('file', fs.createReadStream(imagePath));
        
        // Agregar datos del perro para mantener información
        formData.append('name', dogData.name);
        formData.append('age', dogData.age || '');
        formData.append('breedName', dogData.breedName);
        formData.append('history', dogData.history);
        formData.append('category', dogData.category);
        
        // Campos educativos (si existen)
        if (dogData.alimentacion) {
            formData.append('alimentacion', JSON.stringify(dogData.alimentacion));
        }
        if (dogData.cuidadosBasicos) {
            formData.append('cuidadosBasicos', JSON.stringify(dogData.cuidadosBasicos));
        }
        if (dogData.comportamiento) {
            formData.append('comportamiento', JSON.stringify(dogData.comportamiento));
        }
        if (dogData.juegosFavoritos) {
            formData.append('juegosFavoritos', JSON.stringify(dogData.juegosFavoritos));
        }
        if (dogData.recomendacionesPostAdopcion) {
            formData.append('recomendacionesPostAdopcion', JSON.stringify(dogData.recomendacionesPostAdopcion));
        }

        const response = await axios.put(`${API_BASE}/dogs/${dogId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error actualizando imagen vía API:', error.message);
        throw error;
    }
}

/**
 * Función principal
 * @param {string} dogName - Nombre del perro
 * @param {string} breedName - Raza del perro
 * @param {string} imageSource - Ruta local o URL de la imagen
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

        // Buscar el perro
        console.log(`Buscando perro: ${dogName} (${breedName})...`);
        const dog = await findDog(dogName, breedName);
        
        if (!dog) {
            console.error(`Error: No se encontró ningún perro con nombre "${dogName}" y raza "${breedName}"`);
            
            // Mostrar perros disponibles
            const response = await axios.get(`${API_BASE}/dogs`);
            const dogs = response.data;
            console.log('\nPerros disponibles en la base de datos:');
            dogs.forEach(d => {
                console.log(`  - ${d.name} | Raza: ${d.breedName} | Categoría: ${d.category}`);
            });
            
            process.exit(1);
        }

        console.log(`✅ Perro encontrado: ${dog.name} (ID: ${dog._id})`);
        console.log(`   Imágenes actuales: ${dog.images.length}`);

        // Actualizar imagen usando la API
        console.log('Actualizando imagen vía API...');
        const result = await updateDogImageAPI(dog._id, imagePath, dog);
        
        console.log(`✅ Perro "${dogName}" actualizado exitosamente`);
        console.log(`   Nuevas imágenes: ${result.dog.images.length}`);
        console.log(`   URL: ${result.dog.images[0]}`);
        
        // Eliminar archivo temporal si se creó
        if (isTempFile) {
            fs.unlinkSync(imagePath);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error actualizando imagen del perro:', error.message);
        
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
    console.log('Uso: node scripts/update_dog_image_api.js <nombre_perro> <raza> <ruta_o_url_imagen>');
    console.log('Ejemplo con archivo local: node scripts/update_dog_image_api.js "Firulais" "Golden Retriever" "C:/Users/tu_usuario/Downloads/perro.jpg"');
    console.log('Ejemplo con URL: node scripts/update_dog_image_api.js "Firulais" "Golden Retriever" "https://ejemplo.com/perro.jpg"');
    process.exit(1);
} else {
    const [dogName, breedName, imageSource] = args;
    updateDogImage(dogName, breedName, imageSource);
}
