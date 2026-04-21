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
    { name: "Bruno", breed: "Bulldog Francés", id: "1583337130417-3346a1be7dee", file: "frenchie.jpg" },
    { name: "Snoopy", breed: "Beagle", id: "1543466835-00a7907e9de1", file: "beagle.jpg" },
    { name: "Duque", breed: "Cocker Spaniel", id: "1559190394-df5a28aab5c5", file: "cocker.jpg" },
    { name: "Lassie", breed: "Border Collie", id: "1503256207526-0d5d80fa2f47", file: "border_collie.jpg" },
    { name: "Toro", breed: "Bulldog Inglés", id: "1611611158876-41699b77a059", file: "bulldog.jpg" },
    { name: "Orejas", breed: "Basset Hound", id: "1617748418149-1c5f78b8ac6e", file: "basset.jpg" },
    { name: "Hachi", breed: "Shiba Inu", id: "1583511655857-d19b40a7a54e", file: "shiba.jpg" },
    { name: "Corgito", breed: "Welsh Corgi", id: "1548199973-03cce0bbc87b", file: "corgi.jpg" },
    { name: "Aussie", breed: "Australian Shepherd", id: "1692003122872-6400308772d5", file: "aussie.jpg" },
    { name: "Bull", breed: "Bull Terrier", id: "1621071410946-a71c94c08553", file: "bull_terrier.jpg" },
    { name: "Fritz", breed: "Schnauzer", id: "1585943870180-be99fca07f23", file: "schnauzer_med.jpg" },
    { name: "Samy", breed: "Samoyedo", id: "1706183861983-4997cbe9bd08", file: "samoyedo.jpg" },
    { name: "Sharpy", breed: "Shar Pei", id: "1594814469187-635ae3e385da", file: "sharpei.jpg" },
    { name: "Flash", breed: "Whippet", id: "1615714927995-e638cc7d9bc2", file: "whippet.jpg" },
    { name: "Britt", breed: "Brittany", id: "1726506363335-f82206d5a779", file: "brittany.jpg" }
];

const largeDogs = [
    { name: "Max", breed: "Labrador Retriever", id: "1554456854-55a089fd4cb2", file: "labrador.jpg" },
    { name: "Buddy", breed: "Golden Retriever", id: "1591160690555-5debfba289f0", file: "golden.jpg" },
    { name: "Rex", breed: "Pastor Alemán", id: "1589941013453-ec89f33b5e95", file: "pastor.jpg" },
    { name: "Box", breed: "Boxer", id: "1558349699-1e1c38c05eeb", file: "boxer.jpg" },
    { name: "Rolf", breed: "Rottweiler", id: "1598819849325-f0152d605b08", file: "rottweiler.jpg" },
    { name: "Doby", breed: "Doberman", id: "1536677412572-c277de11e458", file: "doberman.jpg" },
    { name: "Ghost", breed: "Husky Siberiano", id: "1568572933382-74d440642117", file: "husky.jpg" },
    { name: "Apolo", breed: "Gran Danés", id: "1587518102280-8d5fdcb68d13", file: "danes.jpg" },
    { name: "Berni", breed: "San Bernardo", id: "1562193882-0ea2da14e6e3", file: "san_bernardo.jpg" },
    { name: "Baloo", breed: "Bernese Mountain Dog", id: "1560781854-d3d74a1ba2ae", file: "bernese.jpg" },
    { name: "Hachiko", breed: "Akita", id: "1730919362193-d61a410f18cd", file: "akita.jpg" },
    { name: "Blood", breed: "Bloodhound", id: "1616725693607-158e2b9781e1", file: "bloodhound.jpg" },
    { name: "Terra", breed: "Terranova", id: "1560278998-6c40230c9d00", file: "terranova.jpg" },
    { name: "Spot", breed: "Dálmata", id: "1626435872665-2e39a0614b4e", file: "dalmata.jpg" },
    { name: "Galgo", breed: "Galgo", id: "1550268729-a30bcee78dca", file: "galgo.jpg" }
];

async function download(id, filename) {
    const url = `https://images.unsplash.com/${id.startsWith('photo') ? id : 'photo-'+id}?auto=format&fit=crop&q=70&w=800`;
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
                    res2.pipe(fs.createWriteStream(path.join(ASSETS_DIR, filename))).on("finish", resolve);
                });
            } else if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(path.join(ASSETS_DIR, filename))).on("finish", resolve);
            } else { resolve(); }
        }).on("error", () => resolve());
    });
}

async function setup() {
    await mongoose.connect(MONGODB_URI);
    
    console.log("🛠️ Razas Medianas (15)...");
    await Dog.deleteMany({ category: "Raza Mediana" });
    for (const d of mediumDogs) {
        await download(d.id, d.file);
        await new Dog({ ...d, breedName: d.breed, category: "Raza Mediana", image: d.file, history: `${d.name} es un ${d.breed} magnífico que busca un hogar lleno de amor.` }).save();
        console.log(`- ${d.breed} OK`);
    }

    console.log("🛠️ Razas Grandes (15)...");
    await Dog.deleteMany({ category: "Raza Grande" });
    for (const d of largeDogs) {
        await download(d.id, d.file);
        await new Dog({ ...d, breedName: d.breed, category: "Raza Grande", image: d.file, history: `${d.name} es un ${d.breed} noble y leal, listo para proteger a su nueva familia.` }).save();
        console.log(`- ${d.breed} OK`);
    }

    console.log("✅ Finalizado con éxito.");
    process.exit(0);
}

setup();
