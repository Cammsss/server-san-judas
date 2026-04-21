import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configurar cloudinary manualmente porque debido a import, dotenv carga después
if (process.env.CLOUDINARY_URL) {
    const urlParts = process.env.CLOUDINARY_URL.replace("cloudinary://", "").split("@");
    const credentials = urlParts[0].split(":");
    
    cloudinary.config({
        cloud_name: urlParts[1],
        api_key: credentials[0],
        api_secret: credentials[1]
    });
}

export default cloudinary;
