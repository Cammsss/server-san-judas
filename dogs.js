import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

/* =========================
   CONEXIÓN A MONGODB
   Base de datos: dogs
========================= */
mongoose.connect("mongodb://localhost:27017/dogs", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Conectado a MongoDB (dogs)"))
    .catch((err) => console.log("❌ Error de conexión:", err));

/* =========================
   MODELO (colección: dogs)
========================= */
const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breedName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true,
        enum: ['Raza Pequeña', 'Raza Mediana', 'Raza Grande']
    },
    history: {
        type: String,
        required: true
    }
});

// Forzamos que la colección se llame exactamente "dogs"
const Dog = mongoose.model("Dog", dogSchema, "dogs");

/* =========================
   RUTAS
========================= */

// 🔹 GET - Obtener todos los perros
app.get("/dogs", async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener dogs" });
    }
});

// 🔹 POST - Guardar nuevo perro
app.post("/dogs", async (req, res) => {
    try {
        const newDog = new Dog(req.body);
        await newDog.save();
        res.json(newDog);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al guardar dog" });
    }
});

// 🔹 PUT - Actualizar perro por ID
app.put("/dogs/:id", async (req, res) => {
    try {
        const updatedDog = await Dog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedDog);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar dog" });
    }
});

// 🔹 DELETE - Eliminar perro por ID
app.delete("/dogs/:id", async (req, res) => {
    try {
        await Dog.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Dog eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar dog" });
    }
});

/* =========================
   INICIAR SERVIDOR
========================= */
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});