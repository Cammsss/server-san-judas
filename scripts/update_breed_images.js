import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breedName: { type: String, required: true },
    image: { type: String, required: false },
    category: { type: String, required: true }
});

const Dog = mongoose.models.Dog || mongoose.model("Dog", dogSchema, "dogs");

async function updateImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        
        // Actualizar Pomerania para usar la imagen .png 
        await Dog.updateOne(
            { breedName: "Pomerania" },
            { $set: { image: "pomeranian.png" } }
        );
        console.log("✅ Pomerania actualizado con imagen pomeranian.png");
        
        // Actualizar Yorkshire Terrier para usar la imagen .png
        await Dog.updateOne(
            { breedName: "Yorkshire Terrier" },
            { $set: { image: "yorkshire.png" } }
        );
        console.log("✅ Yorkshire Terrier actualizado con imagen yorkshire.png");
        
        // Verificar el estado actual
        const pomeraniaDog = await Dog.findOne({ breedName: "Pomerania" });
        const yorkshireDog = await Dog.findOne({ breedName: "Yorkshire Terrier" });
        
        console.log("\n📋 Estado actual:");
        console.log(`Pomerania: ${pomeraniaDog.image}`);
        console.log(`Yorkshire Terrier: ${yorkshireDog.image}`);
        
        process.exit(0);
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
}

updateImages();