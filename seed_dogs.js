import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Since we are in the server folder, we can try to use their existing model or just the driver
import Dog from './src/dogs/dog.model.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../client/src/data/dogData.json');

async function seed() {
    try {
        await mongoose.connect(process.env.URI_MONGODB || 'mongodb://localhost:27017/Nisecajo');
        console.log('Connected to MongoDB');

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        // Map the fields from the JSON to fit the Mongoose model
        // Note: Missing 'age', 'sex' and 'description' length limit in the model
        const mappedData = data.map(dog => ({
            name: dog.name,
            breedName: dog.breedName,
            age: "2 años",
            image: dog.image,
            category: dog.category || 'Raza Pequeña',
            history: dog.history,
            status: true
        }));

        await Dog.deleteMany({});
        await Dog.insertMany(mappedData);

        console.log('Successfully seeded database with ' + mappedData.length + ' dogs');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
