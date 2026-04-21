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
    { breed: "Chihuahua", id: "1605639101330-f3d9ed440ff5", filename: "chihuahua.jpg" },
    { breed: "Shih Tzu", id: "1591769225440-811ad7d6eca3", filename: "shih_tzu.jpg" },
    { breed: "Papillón", id: "1543130632-7dd9e48aaac9", filename: "papillon.jpg" },
    { breed: "Jack Russell Terrier", id: "1591160674255-fc809b1d7d15", filename: "jack_russell.jpg" }
];

async function downloadImage(id, filename) {
    // Usamos el formato base directo de Unsplash
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=800`;
    const filePath = path.join(ASSETS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                https.get(response.headers.location, (res) => {
                    res.pipe(file);
                    res.on("end", () => resolve());
                });
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                resolve();
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}

async function retryFailed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Re-re-intentando descargas fallidas...");
        
        for (const item of dogData) {
            try {
                await downloadImage(item.id, item.filename);
                await Dog.updateOne(
                    { breedName: item.breed, category: "Raza Pequeña" },
                    { $set: { image: item.filename } }
                );
                console.log(`✅ Corregido: ${item.breed}`);
            } catch (e) {
                console.error(`❌ Sigue fallando ${item.breed}: ${e.message}`);
            }
        }
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

retryFailed();
