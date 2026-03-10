import { Schema, model } from "mongoose";

const adoptionSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "El nombre completo es obligatorio"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        lowercase: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, "La fecha de nacimiento es obligatoria"]
    },
    phone: {
        type: String,
        required: [true, "El teléfono es obligatorio"],
        trim: true
    },
    country: {
        type: String,
        required: [true, "El país es obligatorio"],
        enum: ['Guatemala', 'México', 'El Salvador', 'Honduras', 'Otro'],
        default: 'Guatemala'
    },
    dogName: {
        type: String,
        required: [true, "El nombre del perro es obligatorio"],
        trim: true
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['PENDING', 'ACCEPTED', 'REJECTED']
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Adoption', adoptionSchema);
