import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import path from "path";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";
const ASSETS_DIR = "c:\\Users\\4to. Bach_A\\Desktop\\Bloque 2. Java\\client\\src\\assets\\breeds";

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breedName: { type: String, required: true },
    age: { type: String, required: false },
    image: { type: String, required: false },
    category: { type: String, required: true },
    history: { type: String, required: true },
    status: { type: Boolean, default: true }
});

const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogs");

const dogData = [
    { breed: "Chihuahua", id: "1590634331662-70099446059d", filename: "chihuahua.jpg" },
    { breed: "Pomerania", id: "1583511655857-d19b40a7a54e", filename: "pomeranian.jpg" },
    { breed: "Yorkshire Terrier", id: "1583337130417-3346a1be7dee", filename: "yorkie.jpg" },
    { breed: "Shih Tzu", id: "1591769225440-811ad7d6eca3", filename: "shih_tzu.jpg" },
    { breed: "Pug (Carlino)", id: "1517423440428-a5a00ad493e8", filename: "pug.jpg" },
    { breed: "Dachshund (Perro salchicha)", id: "1612195583950-b8fd34c87093", filename: "dachshund.jpg" },
    { breed: "Bichón Maltés", id: "1533738363-b7f9aef128ce", filename: "maltese.jpg" },
    { breed: "Pinscher Miniatura", id: "1575425186775-b8de9a427e67", filename: "pinscher.jpg" },
    { breed: "Poodle Toy (Caniche Toy)", id: "1598133894008-61f7fdb8cc3a", filename: "poodle.jpg" },
    { breed: "Papillón", id: "1539663464514-8f8e27ca041c", filename: "papillon.jpg" },
    { breed: "Boston Terrier", id: "1517849845537-4d257902454a", filename: "boston.jpg" },
    { breed: "Pequinés", id: "1537151608828-ea2b11777ee8", filename: "pekinese.jpg" },
    { breed: "Jack Russell Terrier", id: "1605725649427-14e3046777ce", filename: "jack_russell.jpg" },
    { breed: "Bichón Frisé", id: "1516734212186-a967f81ad0d7", filename: "bichon_frise.jpg" },
    { breed: "West Highland White Terrier (Westie)", id: "1518020382113-a7e8fc38eac9", filename: "westie.jpg" }
];

async function downloadImage(id, filename) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`;
    const filePath = path.join(ASSETS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log(`✅ Descargada: ${filename}`);
                resolve();
            });
        }).on("error", (err) => {
            fs.unlink(filePath, () => reject(err));
        });
    });
}

async function startLocalMigration() {
    try {
        if (!fs.existsSync(ASSETS_DIR)) {
            fs.mkdirSync(ASSETS_DIR, { recursive: true });
        }

        console.log("⏳ Conectando a Base de Datos...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conectado.");

        console.log("🚀 Iniciando descarga de imágenes locales...");
        for (const item of dogData) {
            try {
                await downloadImage(item.id, item.filename);
                await Dog.updateOne(
                    { breedName: item.breed, category: "Raza Pequeña" },
                    { $set: { image: item.filename } }
                );
            } catch (e) {
                console.error(`❌ Error con ${item.breed}:`, e.message);
            }
        }

        console.log("⭐ ¡Migración a imágenes locales completada!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error general:", error);
        process.exit(1);
    }
}

startLocalMigration();
