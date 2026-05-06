import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.URI_MONGODB || "mongodb://localhost:27017/Nisecajo";

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

const dogs = [
    {
        name: "Pepe",
        breedName: "Chihuahua",
        age: "2 años",
        image: "chihuahua.jpg",
        category: "Raza Pequeña",
        history: "Pepe es pequeño pero con una gran valentía. Es el compañero ideal para un hogar tranquilo."
    },
    {
        name: "Fluffy",
        breedName: "Pomerania",
        age: "1 año",
        image: "pomeranian.jpg",
        category: "Raza Pequeña",
        history: "Fluffy es todo ternura. Su pelaje esponjoso es su mayor orgullo."
    },
    {
        name: "Yorky",
        breedName: "Yorkshire Terrier",
        age: "3 años",
        image: "yorkie.jpg",
        category: "Raza Pequeña",
        history: "Yorky es elegante y siempre está alerta. Un excelente perro guardián a pequeña escala."
    },
    {
        name: "Shishi",
        breedName: "Shih Tzu",
        age: "4 años",
        image: "shih_tzu.jpg",
        category: "Raza Pequeña",
        history: "Shishi es la calma personificada. Le encantan los mimos y las largas siestas."
    },
    {
        name: "Puggy",
        breedName: "Pug (Carlino)",
        age: "2 años",
        image: "pug.jpg",
        category: "Raza Pequeña",
        history: "Puggy es pura diversión. Sus ronquidos y caras te harán reír siempre."
    },
    {
        name: "Salchi",
        breedName: "Dachshund (Perro salchicha)",
        age: "3 años",
        image: "dachshund.jpg",
        category: "Raza Pequeña",
        history: "Salchi es muy inteligente y travieso. Le encanta explorar cada rincón."
    },
    {
        name: "Copita",
        breedName: "Bichón Maltés",
        age: "1 año",
        image: "maltese.jpg",
        category: "Raza Pequeña",
        history: "Copita es blanca y radiante. Es muy traviesa y cariñosa con los niños."
    },
    {
        name: "Pincho",
        breedName: "Pinscher Miniatura",
        age: "2 años",
        image: "pinscher.jpg",
        category: "Raza Pequeña",
        history: "Pincho tiene una energía desbordante. Un pequeño motorcito siempre en marcha."
    },
    {
        name: "Rulo",
        breedName: "Poodle Toy (Caniche Toy)",
        age: "4 años",
        image: "poodle.jpg",
        category: "Raza Pequeña",
        history: "Rulo es súper inteligente. Aprende trucos en segundos y es muy receptivo."
    },
    {
        name: "Alas",
        breedName: "Papillón",
        age: "3 años",
        image: "papillon.jpg",
        category: "Raza Pequeña",
        history: "Alas destaca por su elegancia y sus orejas de mariposa."
    },
    {
        name: "Tux",
        breedName: "Boston Terrier",
        age: "5 años",
        image: "boston.jpg",
        category: "Raza Pequeña",
        history: "Tux es un perro muy educado. El compañero perfecto para la vida urbana."
    },
    {
        name: "Susi",
        breedName: "Pequinés",
        age: "6 años",
        image: "pekinese.jpg",
        category: "Raza Pequeña",
        history: "Susi es una pequeña leona muy protectora de su familia."
    },
    {
        name: "Jacky",
        breedName: "Jack Russell Terrier",
        age: "2 años",
        image: "jack_russell.jpg",
        category: "Raza Pequeña",
        history: "Jacky es puro dinamismo. Estará encantado de acompañarte a correr."
    },
    {
        name: "Frisé",
        breedName: "Bichón Frisé",
        age: "1 año",
        image: "bichon_frise.jpg",
        category: "Raza Pequeña",
        history: "Frisé es la alegría de la casa, siempre moviendo la cola."
    },
    {
        name: "Blas",
        breedName: "West Highland White Terrier (Westie)",
        age: "3 años",
        image: "westie.jpg",
        category: "Raza Pequeña",
        history: "Blas es valiente y aventurero, un pequeño Terrier con gran corazón."
    }
];

async function replaceDogs() {
    try {
        console.log("⏳ Conectando...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conectado.");
        await Dog.deleteMany({ category: "Raza Pequeña" });
        console.log("🚀 Insertando...");
        await Dog.insertMany(dogs);
        console.log("⭐ ¡Listo!");
        process.exit(0);
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
}

replaceDogs();
