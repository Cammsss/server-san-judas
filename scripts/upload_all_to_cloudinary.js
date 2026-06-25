import mongoose from "mongoose";
import cloudinary from "./configs/cloudinary.js";
import Dog from "./src/dogs/dog.model.js";
import path from "path";
import fs from "fs";
import 'dotenv/config';

// Carpetas locales donde pueden estar guardadas tus fotos actualmente
const ASSETS_DIR = path.resolve("../client/src/assets/breeds");
const UPLOADS_DIR = path.resolve("./public/uploads/dogs");

async function uploadToCloudinary() {
    try {
        console.log("⏳ Conectando a la base de datos...");
        await mongoose.connect(process.env.URI_MONGODB || "mongodb://127.0.0.1:27017/Nisecajo");
        console.log("✅ Conectado a la base de datos.");

        const dogs = await Dog.find();
        console.log(`🐶 Se encontraron ${dogs.length} perros en la base de datos.`);

        for (const dog of dogs) {
            if (!dog.image) continue;

            // 1. Si la foto ya está en Cloudinary, la ignoramos.
            if (dog.image.includes("res.cloudinary.com")) {
                console.log(`✅ ${dog.name} ya está en Cloudinary. Omitiendo...`);
                continue;
            }

            let localPath = "";

            // 2. Buscamos si la foto existe en tus carpetas locales
            if (fs.existsSync(path.join(ASSETS_DIR, dog.image))) {
                localPath = path.join(ASSETS_DIR, dog.image);
            } else if (fs.existsSync(path.join(UPLOADS_DIR, dog.image))) {
                localPath = path.join(UPLOADS_DIR, dog.image);
            } else if (fs.existsSync(dog.image)) {
                localPath = dog.image;
            }

            // 3. Si encontramos la foto localmente, la subimos
            if (localPath) {
                console.log(`☁️ Subiendo imagen de ${dog.name} desde tu computadora a Cloudinary...`);
                try {
                    const result = await cloudinary.uploader.upload(localPath, { folder: "dogs" });
                    
                    // Actualizamos la base de datos con la nueva URL oficial de Cloudinary
                    dog.image = result.secure_url;
                    await dog.save();
                    
                    console.log(`✅ ${dog.name} actualizado: ${result.secure_url}`);
                } catch (err) {
                    console.error(`❌ Error al subir a ${dog.name}:`, err.message);
                }
            } 
            // 4. Si la imagen es una URL de internet (de otra página), Cloudinary puede descargarla y subirla también
            else if (dog.image.startsWith("http")) {
                 console.log(`☁️ Subiendo imagen de ${dog.name} desde una página externa a Cloudinary...`);
                 try {
                     const result = await cloudinary.uploader.upload(dog.image, { folder: "dogs" });
                     dog.image = result.secure_url;
                     await dog.save();
                     console.log(`✅ ${dog.name} actualizado: ${result.secure_url}`);
                 } catch(extErr){
                      console.error(`❌ Error al subir la imagen externa de ${dog.name}:`, extErr.message);
                 }
            } else {
                console.log(`⚠️ No se encontró la foto para ${dog.name} (buscaba archivo: ${dog.image}).`);
            }
        }

        console.log("\n🎉 ¡Proceso terminado! Todas las imágenes procesadas.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error de ejecución:", error);
        process.exit(1);
    }
}

uploadToCloudinary();
