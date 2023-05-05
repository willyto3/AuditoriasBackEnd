//? IMPORTACION DE DEPENDENCIAS
import { validationResult } from 'express-validator'

// Se crea una funcion para validar los errores
export const validacionErrores = (req, res, next) => {
  const errores = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(501).json({
      ok: false,
      errores: errores.mapped()
    })
  }

  next()
}

