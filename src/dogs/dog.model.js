import { Schema, model } from "mongoose";

const dogSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    breedName: {
        type: String,
        required: [true, "La raza es obligatoria"],
        trim: true
    },
    age: {
        type: String, // Cambiado a String para soportar '2 años' etc o Number si prefieres
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: [true, "La categoría es obligatoria"],
        enum: ['Raza Pequeña', 'Raza Mediana', 'Raza Grande']
    },
    history: {
        type: String,
        required: [true, "La historia es obligatoria"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Dog', dogSchema);
