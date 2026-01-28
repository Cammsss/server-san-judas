import { check, body } from "express-validator";
import { validarCampos } from "./validate-values.js";

export const createDogValidator = [
    // Validate text fields
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    body('age', 'La edad es obligatoria').not().isEmpty(),
    body('age', 'La edad debe ser un número').isNumeric(),
    body('sex', 'El sexo es obligatorio').not().isEmpty(),
    body('sex', 'El sexo debe ser macho o hembra').isIn(['macho', 'hembra', 'Macho', 'Hembra']),
    body('breed', 'La raza es obligatoria').not().isEmpty(),
    body('description', 'La descripción es obligatoria').not().isEmpty(),
    body('description', 'La descripción no puede exceder las 100 palabras').custom(value => {
        if (!value) return true;
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount > 100) return false;
        return true;
    }),

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
