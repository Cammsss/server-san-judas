import { check, body } from "express-validator";
import { validarCampos } from "./validate-values.js";

export const createDogValidator = [
    // Validate required text fields
    body('name', 'El nombre es obligatorio').not().isEmpty().trim(),
    body('breedName', 'La raza es obligatoria').not().isEmpty().trim(),
    body('category', 'La categoría es obligatoria').not().isEmpty(),
    body('category', 'La categoría debe ser válida').isIn(['Raza Pequeña', 'Raza Mediana', 'Raza Grande']),
    body('history', 'La historia es obligatoria').not().isEmpty().trim(),
    
    // Optional fields
    body('age').optional().trim(),
    
    // Optional educational fields - basic validation
    body('alimentacion').optional().isObject(),
    body('alimentacion.tipoComida').optional().isObject(),
    body('alimentacion.tipoComida.value').optional().isIn(['cachorro', 'adulto', 'necesidades_especiales']),
    body('cuidadosBasicos').optional().isObject(),
    body('cuidadosBasicos.ejercicio').optional().isObject(),
    body('cuidadosBasicos.ejercicio.nivel').optional().isIn(['bajo', 'medio', 'alto']),
    body('comportamiento').optional().isObject(),
    body('comportamiento.nivelEnergia').optional().isObject(),
    body('comportamiento.nivelEnergia.valor').optional().isIn(['bajo', 'medio', 'alto']),
    body('juegosFavoritos').optional().isObject(),
    body('recomendacionesPostAdopcion').optional().isObject(),

    // Custom validator for images (Multer places files in req.files)
    (req, res, next) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "Error de validación",
                error: "Debe subir al menos una imagen"
            });
        }
        next();
    },

    validarCampos
];

export const updateDogValidator = [
    // All fields are optional for updates
    body('name').optional().trim(),
    body('breedName').optional().trim(),
    body('category').optional().isIn(['Raza Pequeña', 'Raza Mediana', 'Raza Grande']),
    body('history').optional().trim(),
    body('age').optional().trim(),
    
    // Optional educational fields
    body('alimentacion').optional().isObject(),
    body('cuidadosBasicos').optional().isObject(),
    body('comportamiento').optional().isObject(),
    body('juegosFavoritos').optional().isObject(),
    body('recomendacionesPostAdopcion').optional().isObject(),

    validarCampos
];
