import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.URI_MONGODB || "mongodb://localhost:27017/Nisecajo";

async function checkCounts() {
    try {
        console.log("Connecting to:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully.");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));

        const dogsCol = mongoose.connection.db.collection('dogs');
        const totalDogs = await dogsCol.countDocuments({});
        console.log("Total dogs in collection:", totalDogs);

        const categories = await dogsCol.distinct('category');
        console.log("Distinct categories found:", categories);

        for (const cat of categories) {
            const count = await dogsCol.countDocuments({ category: cat });
            const list = await dogsCol.find({ category: cat }).toArray();
            console.log(`\nCategory: "${cat}" (${count} dogs)`);
            list.forEach(dog => {
                console.log(` - Name: ${dog.name}, Breed: ${dog.breedName || dog.breed}, Image: ${dog.image}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error("Error running script:", error);
        process.exit(1);
    }
}

checkCounts();
