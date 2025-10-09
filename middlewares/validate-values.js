import { validationResult } from 'express-validator'

export const validarCampos = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Errores de validación')
        error.status = 400
        error.erros = errors.array()
        return res.status(400).json(error)
    }
    next()
}