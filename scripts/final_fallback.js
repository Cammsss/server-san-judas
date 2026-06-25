import mongoose from "mongoose";
import https from "https";
import fs from "fs";
import path from "path";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";
const ASSETS_DIR = "c:\\Users\\4to. Bach_A\\Desktop\\Bloque 2. Java\\client\\src\\assets\\breeds";

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breedName: { type: String, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true }
});

const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogs");

const fallbacks = [
    { breed: "Chihuahua", id: "1593134253907-bbad3d3b7511", filename: "chihuahua.jpg" },
    { breed: "Shih Tzu", id: "1552053831-71594a27632d", filename: "shih_tzu.jpg" },
    { breed: "Papillón", id: "1561037404-61cd46aa615b", filename: "papillon.jpg" },
    { breed: "Jack Russell Terrier", id: "1518717758536-85ae29035b6d", filename: "jack_russell.jpg" }
];

async function download(id, filename) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=60&w=600`;
    const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };
    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) return reject(new Error(res.statusCode));
            res.pipe(fs.createWriteStream(path.join(ASSETS_DIR, filename))).on("finish", resolve);
        });
    });
}

async function finish() {
    await mongoose.connect(MONGODB_URI);
    for (const f of fallbacks) {
        try {
            await download(f.id, f.filename);
            await Dog.updateOne({ breedName: f.breed }, { $set: { image: f.filename } });
            console.log(`✅ ${f.breed} listo.`);
        } catch (e) {
            console.log(`❌ ${f.breed} falló.`);
        }
    }
    process.exit(0);
}
finish();
