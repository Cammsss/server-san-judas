import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
    },
    verificationCode: {
        type: String,
        default: null
    },
    verificationExpires: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('User', userSchema);
