import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";

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

const newDogs = [
    {
        name: "Pipo",
        breedName: "Boston Terrier",
        age: "2 años",
        image: "boston_terrier.jpg",
        category: "Raza Pequeña",
        history: "Pipo es un pequeño caballero con un corazón gigante. Fue rescatado de una situación de abandono pero nunca perdió su elegancia ni su buen humor. Es muy inteligente, aprende trucos rápido y le encanta dormir la siesta bajo el sol. Busca una familia que le brinde mucho amor y juegos suaves."
    },
    {
        name: "Bella",
        breedName: "Jack Russell Terrier",
        age: "1 año",
        image: "jack_russell.jpg",
        category: "Raza Pequeña",
        history: "Bella es pura energía y alegría. Siempre está lista para una aventura o para perseguir una pelota. A pesar de su tamaño, tiene una valentía asombrosa. Es la compañera ideal para personas activas que disfrutan de largos paseos y mucha diversión. Es sumamente leal y protectora con quienes ama."
    },
    {
        name: "Cookie",
        breedName: "Cavalier King Charles",
        age: "3 años",
        image: "cavalier.jpg",
        category: "Raza Pequeña",
        history: "Cookie es la dulzura hecha perrita. Sus ojos grandes y expresivos te derretirán el corazón al instante. Le encanta estar en compañía de humanos y se lleva de maravilla con otros animales. Es tranquila, paciente y muy cariñosa. Ideal para un hogar que busque paz y una compañera fiel para ver películas en el sofá."
    },
    {
        name: "Sparky",
        breedName: "Schnauzer Miniatura",
        age: "4 años",
        image: "schnauzer.jpg",
        category: "Raza Pequeña",
        history: "Sparky es un perrito con mucha personalidad y carácter. Es muy observador y siempre está atento a lo que sucede a su alrededor. Le gusta sentirse parte de la familia y participar en todas las actividades. Es valiente, inteligente y tiene un ladrido amigable que usa para saludar a sus amigos."
    },
    {
        name: "Daisy",
        breedName: "Pequinés",
        age: "5 años",
        image: "pekinese.jpg",
        category: "Raza Pequeña",
        history: "Daisy es una pequeña princesa que sabe lo que quiere. Es independiente pero muy afectuosa cuando entra en confianza. Tiene un pelaje hermoso que le encanta que cepillen. Busca un hogar tranquilo donde la traten con el respeto y el cariño que se merece. Es una excelente compañera para personas que viven en apartamentos."
    }
];

async function addDogs() {
    try {
        console.log("⏳ Conectando a MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conectado.");

        console.log(`🚀 Insertando ${newDogs.length} nuevos perritos de raza pequeña...`);
        await Dog.insertMany(newDogs);

        console.log("⭐ ¡Los 5 nuevos perritos han sido registrados exitosamente!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al insertar:", error);
        process.exit(1);
    }
}

addDogs();
