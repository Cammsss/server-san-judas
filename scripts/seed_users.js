import mongoose from 'mongoose';
import User from './src/users/user.model.js';
import dotenv from 'dotenv';
import { hash } from 'argon2';

dotenv.config();

const usersData = [
  { name: 'Juan', surname: 'Pérez', username: 'juanp', email: 'juan@example.com', password: 'password123' },
  { name: 'María', surname: 'Gómez', username: 'mariag', email: 'maria@example.com', password: 'password123' },
  { name: 'Carlos', surname: 'López', username: 'carlosl', email: 'carlos@example.com', password: 'password123' },
  { name: 'Ana', surname: 'Martínez', username: 'anam', email: 'ana@example.com', password: 'password123' },
  { name: 'Luis', surname: 'Rodríguez', username: 'luisr', email: 'luis@example.com', password: 'password123' },
  { name: 'Laura', surname: 'Fernández', username: 'lauraf', email: 'laura@example.com', password: 'password123' },
  { name: 'Pedro', surname: 'García', username: 'pedrog', email: 'pedro@example.com', password: 'password123' },
  { name: 'Sofía', surname: 'Díaz', username: 'sofiad', email: 'sofia@example.com', password: 'password123' },
  { name: 'Jorge', surname: 'Hernández', username: 'jorgeh', email: 'jorge@example.com', password: 'password123' },
  { name: 'Marta', surname: 'Álvarez', username: 'martaa', email: 'marta@example.com', password: 'password123' },
  { name: 'Diego', surname: 'Romero', username: 'diegor', email: 'diego@example.com', password: 'password123' },
  { name: 'Elena', surname: 'Navarro', username: 'elenan', email: 'elena@example.com', password: 'password123' },
  { name: 'Miguel', surname: 'Torres', username: 'miguelt', email: 'miguel@example.com', password: 'password123' },
  { name: 'Lucía', surname: 'Ruiz', username: 'luciar', email: 'lucia@example.com', password: 'password123' },
  { name: 'Raúl', surname: 'Sánchez', username: 'rauls', email: 'raul@example.com', password: 'password123' },
  { name: 'Carmen', surname: 'Ramírez', username: 'carmenr', email: 'carmen@example.com', password: 'password123' },
  { name: 'Pablo', surname: 'Flores', username: 'pablof', email: 'pablo@example.com', password: 'password123' },
  { name: 'Paula', surname: 'Gutiérrez', username: 'paulag', email: 'paula@example.com', password: 'password123' },
  { name: 'Andrés', surname: 'Molina', username: 'andresm', email: 'andres@example.com', password: 'password123' },
  { name: 'Isabel', surname: 'Castro', username: 'isabelc', email: 'isabel@example.com', password: 'password123' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.URI_MONGODB || 'mongodb://localhost:27017/Nisecajo');
        console.log('Connected to MongoDB');

        // Note: we are not deleting existing users by default to avoid losing admin accounts
        // Uncomment the line below if you want to wipe the users collection first
        // await User.deleteMany({});
        
        console.log('Hashing passwords...');
        const hashedUsers = await Promise.all(usersData.map(async (user) => {
            const encryptedPassword = await hash(user.password);
            return {
                ...user,
                password: encryptedPassword
            };
        }));

        console.log('Inserting 20 users...');
        await User.insertMany(hashedUsers);

        console.log('Successfully seeded database with 20 users.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seed();
