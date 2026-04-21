import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/Nisecajo";

async function updateImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;

        const updates = [
            { name: "Pipo", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800" },
            { name: "Bella", image: "https://images.unsplash.com/photo-1605725649427-14e3046777ce?auto=format&fit=crop&q=80&w=800" },
            { name: "Cookie", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800" },
            { name: "Sparky", image: "https://images.unsplash.com/photo-1550974534-11756578d6b6?auto=format&fit=crop&q=80&w=800" },
            { name: "Daisy", image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800" }
        ];

        for (const update of updates) {
            await db.collection("dogs").updateOne({ name: update.name, category: "Raza Pequeña" }, { $set: { image: update.image } });
        }

        console.log("Images updated!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

updateImages();
