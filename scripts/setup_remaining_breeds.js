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

const mediumDogs = [
    { name: "Bruno", breed: "Bulldog Francés", id: "1583337060640-f9664fa6f4b3", file: "frenchie.jpg" },
    { name: "Snoopy", breed: "Beagle", id: "1537204559845-a461f237f374", file: "beagle.jpg" },
    { name: "Cocker", breed: "Cocker Spaniel", id: "1591769225440-811ad7d6eca3", file: "cocker.jpg" },
    { name: "Lassie", breed: "Border Collie", id: "1568393691-605fa359240e", file: "border_collie.jpg" },
    { name: "Toro", breed: "Bulldog Inglés", id: "1583511655826-05700d52f4d9", file: "bulldog.jpg" },
    { name: "Orejas", breed: "Basset Hound", id: "1583511655857-d19b40a7a54e", file: "basset.jpg" },
    { name: "Hachiko", breed: "Shiba Inu", id: "1583511655826-05700d52f4d9", file: "shiba.jpg" },
    { name: "Corgi", breed: "Welsh Corgi", id: "1517849845537-4d257902454a", file: "corgi.jpg" },
    { name: "Aussie", breed: "Australian Shepherd", id: "1561037404-61cd46aa615b", file: "aussie.jpg" },
    { name: "Bull", breed: "Bull Terrier", id: "1518717758536-85ae29035b6d", file: "bull_terrier.jpg" }
];

const largeDogs = [
    { name: "Max", breed: "Labrador Retriever", id: "1552053831-71594a27632d", file: "labrador.jpg" },
    { name: "Buddy", breed: "Golden Retriever", id: "1506755855023-4759600028d8", file: "golden.jpg" },
    { name: "Rex", breed: "Pastor Alemán", id: "1589924691151-df0745f52f77", file: "pastor.jpg" },
    { name: "Box", breed: "Boxer", id: "1583337130417-3346a1be7dee", file: "boxer.jpg" },
    { name: "Rolf", breed: "Rottweiler", id: "1561037404-61cd46aa615b", file: "rottweiler.jpg" },
    { name: "Doby", breed: "Doberman", id: "1518717758536-85ae29035b6d", file: "doberman.jpg" },
    { name: "Ghost", breed: "Husky Siberiano", id: "1583511655826-05700d52f4d9", file: "husky.jpg" },
    { name: "Apolo", breed: "Gran Danés", id: "1568393691-605fa359240e", file: "danes.jpg" },
    { name: "Berni", breed: "San Bernardo", id: "1583511655857-d19b40a7a54e", file: "san_bernardo.jpg" },
    { name: "Baloo", breed: "Terranova", id: "1517849845537-4d257902454a", file: "terranova.jpg" }
];

async function download(id, filename) {
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=60&w=800`;
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode !== 200) { resolve(); return; }
            res.pipe(fs.createWriteStream(path.join(ASSETS_DIR, filename))).on("finish", resolve);
        }).on("error", () => resolve());
    });
}

async function setup() {
    await mongoose.connect(MONGODB_URI);
    
    console.log("🛠️ Configurando Razas Medianas...");
    await Dog.deleteMany({ category: "Raza Mediana" });
    for (const d of mediumDogs) {
        await download(d.id, d.file);
        await new Dog({ ...d, breedName: d.breed, category: "Raza Mediana", image: d.file, history: `${d.name} es un ${d.breed} increíble con mucha energía.` }).save();
    }

    console.log("🛠️ Configurando Razas Grandes...");
    await Dog.deleteMany({ category: "Raza Grande" });
    for (const d of largeDogs) {
        await download(d.id, d.file);
        await new Dog({ ...d, breedName: d.breed, category: "Raza Grande", image: d.file, history: `${d.name} es un ${d.breed} noble y protector.` }).save();
    }

    console.log("✅ Proceso completado.");
    process.exit(0);
}

setup();
