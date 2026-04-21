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

const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogs");

async function updateChihuahua() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        // Ahora usamos la imagen LOCAL para evitar problemas de carga externa
        const result = await Dog.updateOne(
            { breedName: "Chihuahua", category: "Raza Pequeña" },
            { $set: { image: "chihuahua.jpg" } }
        );

        console.log("✅ Chihuahua actualizado a imagen LOCAL.");
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

updateChihuahua();
