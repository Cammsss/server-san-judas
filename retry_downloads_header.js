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
    { breed: "Shih Tzu", id: "1591769225440-811ad7d6eca3", filename: "shih_tzu.jpg" },
    { breed: "Papillón", id: "1539663464514-8f8e27ca041c", filename: "papillon.jpg" },
    { breed: "Jack Russell Terrier", id: "1605725649427-14e3046777ce", filename: "jack_russell.jpg" }
];

async function downloadImage(id, filename) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;
    const filePath = path.join(ASSETS_DIR, filename);
    const file = fs.createWriteStream(filePath);

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                 // Handle redirect
                https.get(response.headers.location, options, (res) => {
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
        }).on("error", (err) => reject(err));
    });
}

async function retryFailed() {
    try {
        await mongoose.connect(MONGODB_URI);
        for (const item of dogData) {
            try {
                await downloadImage(item.id, item.filename);
                await Dog.updateOne({ breedName: item.breed }, { $set: { image: item.filename } });
                console.log(`✅ ${item.breed} cargado.`);
            } catch (e) {
                console.log(`❌ ${item.breed} falló: ${e.message}`);
            }
        }
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

retryFailed();
