import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breedName: { type: String, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true }
});

const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogs");

async function checkImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        const dogs = await Dog.find({ category: "Raza Pequeña" });
        
        console.log("Perros de raza pequeña y sus imágenes:");
        dogs.forEach(dog => {
            console.log(`${dog.breedName} (${dog.name}): ${dog.image}`);
        });
        
        // Verificar duplicados
        const images = dogs.map(d => d.image);
        const duplicates = images.filter((item, index) => images.indexOf(item) !== index);
        if (duplicates.length > 0) {
            console.log("\n⚠️ Imágenes duplicadas encontradas:", [...new Set(duplicates)]);
        } else {
            console.log("\n✅ No hay imágenes duplicadas");
        }
        
        process.exit(0);
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
}

checkImages();