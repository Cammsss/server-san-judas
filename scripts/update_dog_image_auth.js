import fs from 'fs';
import https from 'https';
import path from 'path';
import { exec } from 'child_process';

const API_BASE = 'https://aloa-server-sanjudas.vercel.app/api';

/**
 * Descarga una imagen desde una URL
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
 * Hace una petición HTTP POST
 */
function httpsPost(url, data, token = null) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const req = https.request(url, options, (response) => {
            let responseData = '';
            response.on('data', chunk => responseData += chunk);
            response.on('end', () => {
                try {
                    resolve(JSON.parse(responseData));
                } catch (e) {
                    reject(e);
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Hace una petición HTTP GET
 */
function httpsGet(url, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {}
        };
        
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        
        https.get(url, options, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

/**
 * Login para obtener token
 */
async function login(username, password) {
    try {
        console.log('🔐 Iniciando sesión...');
        console.log(`📍 URL: ${API_BASE}/login`);
        const response = await httpsPost(`${API_BASE}/login`, {
            username,
            password
        });
        
        console.log('📋 Respuesta del servidor:', JSON.stringify(response, null, 2));
        
        if (response.userDetails && response.userDetails.token) {
            console.log('✅ Login exitoso');
            return response.userDetails.token;
        } else {
            throw new Error('No se recibió token en la respuesta');
        }
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        throw error;
    }
}

/**
 * Busca un perro por nombre y raza
 */
async function findDog(dogName, breedName, token) {
    try {
        const response = await httpsGet(`${API_BASE}/dogs`, token);
        const dogs = response;
        
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
 * Función principal
 */
async function updateDogImage(dogName, breedName, imageSource, username, password) {
    let imagePath = imageSource;
    let isTempFile = false;
    let token = null;

    try {
        // Login para obtener token
        token = await login(username, password);

        // Verificar si es una URL o archivo local
        if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
            console.log('📥 Detectada URL de imagen, descargando...');
            imagePath = await downloadImage(imageSource);
            isTempFile = true;
            console.log(`✅ Imagen descargada a: ${imagePath}`);
        } else {
            if (!fs.existsSync(imageSource)) {
                console.error(`❌ Error: El archivo no existe: ${imageSource}`);
                process.exit(1);
            }
        }

        // Buscar el perro
        console.log(`🔍 Buscando perro: ${dogName} (${breedName})...`);
        const dog = await findDog(dogName, breedName, token);
        
        if (!dog) {
            console.error(`❌ Error: No se encontró ningún perro con nombre "${dogName}" y raza "${breedName}"`);
            
            // Mostrar perros disponibles
            const response = await httpsGet(`${API_BASE}/dogs`, token);
            const dogs = response;
            console.log('\n📋 Perros disponibles en la base de datos:');
            dogs.forEach(d => {
                console.log(`  - ${d.name} | Raza: ${d.breedName} | Categoría: ${d.category}`);
            });
            
            process.exit(1);
        }

        console.log(`✅ Perro encontrado: ${dog.name} (ID: ${dog._id})`);
        console.log(`   Imágenes actuales: ${dog.images.length}`);

        // Ejecutar comando curl para actualizar
        console.log('\n📤 Subiendo imagen a Cloudinary vía API...');
        
        const curlCommand = `curl -X PUT "${API_BASE}/dogs/${dog._id}" -H "Authorization: Bearer ${token}" -F "file=@${imagePath}" -F "name=${dog.name}" -F "age=${dog.age || ''}" -F "breedName=${dog.breedName}" -F "history=${dog.history}" -F "category=${dog.category}"`;
        
        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Error ejecutando curl:', error.message);
                console.error('stderr:', stderr);
            } else {
                console.log('✅ Imagen actualizada exitosamente');
                console.log('📋 Respuesta:', stdout);
            }
            
            // Eliminar archivo temporal si se creó
            if (isTempFile) {
                fs.unlinkSync(imagePath);
                console.log(`🗑️  Archivo temporal eliminado: ${imagePath}`);
            }
            
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (isTempFile && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        process.exit(1);
    }
}

// Obtener argumentos
const args = process.argv.slice(2);

if (args.length < 5) {
    console.log('Uso: node scripts/update_dog_image_auth.js <nombre_perro> <raza> <ruta_o_url_imagen> <usuario> <contraseña>');
    console.log('Ejemplo: node scripts/update_dog_image_auth.js "Fluffy" "Pomerania" "https://ejemplo.com/perro.jpg" "miusuario" "micontraseña"');
    process.exit(1);
} else {
    const [dogName, breedName, imageSource, username, password] = args;
    updateDogImage(dogName, breedName, imageSource, username, password);
}
