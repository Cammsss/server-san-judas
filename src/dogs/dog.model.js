import { Schema, model } from "mongoose";

const dogSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "La edad es obligatoria"],
    },
    sex: {
        type: String,
        required: [true, "El sexo es obligatorio"],
        enum: ["macho", "hembra", "Macho", "Hembra"],
    },
    breed: {
        type: String,
        required: [true, "La raza es obligatoria"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        maxLength: [100, "La descripción no puede exceder los 100 caracteres"],
        trim: true
    },
    images: [{
        type: String, // Paths to the uploaded images
        required: true
    }],
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Dog', dogSchema);
