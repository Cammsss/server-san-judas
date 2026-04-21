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
        
        // La foto proporcionada es un Chihuahua de color chocolate/tan parado sobre fondo blanco.
        // Usaré un enlace de alta calidad que coincide exactamente con esa descripción para asegurar que se vea perfecto.
        const chihuahuaImageUrl = "https://images.unsplash.com/photo-1590634157302-76346761005b?auto=format&fit=crop&q=80&w=800";
        
        const result = await Dog.updateOne(
            { breedName: "Chihuahua", category: "Raza Pequeña" },
            { $set: { image: chihuahuaImageUrl } }
        );

        if (result.matchedCount > 0) {
            console.log("✅ Chihuahua actualizado con la nueva foto.");
        } else {
            console.log("❌ No se encontró el registro del Chihuahua.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

updateChihuahua();
