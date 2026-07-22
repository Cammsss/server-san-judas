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
        type: String,
    },
    images: [{
        type: String,
        required: false
    }],
    videos: [{
        type: String,
        required: false
    }],
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
    },
    // Nuevos campos educativos
    alimentacion: {
        tipoComida: {
            value: { 
                type: String, 
                enum: ['cachorro', 'adulto', 'necesidades_especiales'] 
            },
            label: String
        },
        porcionesDiarias: {
            cantidad: String,
            frecuencia: String
        },
        restriccionesMedicas: {
            tieneRestricciones: { type: Boolean, default: false },
            detalles: String,
            alimentosEvitar: [String]
        },
        tooltip: String
    },
    cuidadosBasicos: {
        cepillado: {
            frecuencia: String,
            tipoPelo: String,
            herramientasRecomendadas: [String]
        },
        ejercicio: {
            nivel: { 
                type: String, 
                enum: ['bajo', 'medio', 'alto'] 
            },
            minutosDiarios: Number,
            tipoActividad: String
        },
        salud: {
            vacunasAlDia: { type: Boolean, default: false },
            desparasitacionesAlDia: { type: Boolean, default: false },
            proximaVacuna: String,
            proximaDesparasitacion: String
        },
        aseo: {
            banioFrecuencia: String,
            corteUñas: String,
            limpiezaOidos: String,
            cuidadoDental: String
        },
        tooltip: String
    },
    comportamiento: {
        convivenciaNinos: {
            compatible: { type: Boolean, default: false },
            edadMinima: String,
            observaciones: String
        },
        relacionPerros: {
            compatible: { type: Boolean, default: false },
            preferencias: String,
            observaciones: String
        },
        relacionGatos: {
            compatible: { type: Boolean, default: false },
            observaciones: String
        },
        nivelEnergia: {
            valor: { 
                type: String, 
                enum: ['bajo', 'medio', 'alto'] 
            },
            descripcion: String
        },
        toleranciaSoledad: {
            horasMaximas: Number,
            recomendaciones: String
        },
        tooltip: String
    },
    juegosFavoritos: {
        actividadesPreferidas: [{
            nombre: String,
            descripcion: String,
            duracion: String
        }],
        juguetesRecomendados: [{
            tipo: String,
            razon: String,
            seguridad: String
        }],
        juegosEvitar: [String],
        tooltip: String
    },
    recomendacionesPostAdopcion: {
        primerosDias: {
            periodoAdaptacion: String,
            preparacionEspacio: [String],
            rutinasEstablecer: [String]
        },
        consejosSemana1: [String],
        consejosSemana2: [String],
        consejosSemana3: [String],
        senalesAdaptacion: [String],
        cuandoContactarVeterinario: String,
        tooltip: String
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Dog', dogSchema);
