import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   DEFINICIÓN DEL MODELO
========================= */
const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breedName: { type: String, required: true },
    age: { type: String, required: false },
    image: { type: String, required: false },
    category: { type: String, required: true },
    history: { type: String, required: true },
    status: { type: Boolean, default: true }
});

const Dog = mongoose.model("Dog", dogSchema, "dogs");

/* =========================
   CONFIGURACIÓN
========================= */
const MONGODB_URI = process.env.URI_MONGODB || "mongodb://localhost:27017/Nisecajo";
const JSON_FILE_PATH = path.join(__dirname, "../client/src/data/dogData.json");

/* =========================
   FUNCIÓN DE SEEDING
========================= */
async function seedDatabase() {
    try {
        console.log("⏳ Conectando a MongoDB...");
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Conectado a MongoDB.");

        console.log(`📂 Leyendo archivo JSON: ${JSON_FILE_PATH}`);
        const data = JSON.parse(fs.readFileSync(JSON_FILE_PATH, "utf-8"));

        // Mapear los datos si es necesario (en este caso el JSON ya tiene los campos correctos)
        const dogsWithAge = data.map(dog => ({
            ...dog,
            age: dog.age || Math.floor(Math.random() * 10) + 1 // Añadir edad aleatoria si no existe
        }));

        console.log("🗑️ Limpiando colección 'dogs'...");
        await Dog.deleteMany({});

        console.log(`🚀 Insertando ${dogsWithAge.length} perritos...`);
        await Dog.insertMany(dogsWithAge);

        console.log("⭐ ¡Base de datos poblada exitosamente!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error durante el seeding:", error);
        process.exit(1);
    }
}

seedDatabase();
