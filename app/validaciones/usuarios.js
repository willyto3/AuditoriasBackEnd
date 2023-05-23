//? IMPORTACION DE DEPENDENCIAS
// Se importa Check de Express-Validator
import { check } from 'express-validator'

// Se importa el archivo Validacion de Errores
import { validacionErrores } from '../middleware/validacionErrores.js'

//? IMPORTACION DE MODELOS
// Importacón del Modelo Usuario
import Usuario from '../modelos/Usuario.js'

// Funcion para realizar las verificaciones al crear un usuario
export const validarRegistro = [
  //PASSWORD
  // Que la contraseña exista, no se encuentre vacio y que no sea menor a 5 digitos
  check('contrasena', 'La contraseña debe tener minimo 5 caracteres')
    .exists()
    .notEmpty()
    .isLength({ min: 5 }),
  //EMAIL
  // Que el email exista, no se encuentre vacio y que cumpla con el formato de un correo
  check('email', 'Debe ser un formato valido para Email')
    .exists()
    .notEmpty()
    .isEmail()
    // Que no este duplicado el email en la base de datos
    .custom(async (value) => {
      const usuario = await Usuario.findOne({ email: value }).lean().exec()
      if (usuario) {
        return Promise.reject('Email ya esta registrado')
      }
    }),
  // DOCUMENTO
  // Que el documento exista, no se encuentre vacio
  check('documento', 'El Documento del Usuario es Requerido')
    .exists()
    .notEmpty()
    // Que no este duplicado el email en la base de datos
    .custom(async (value) => {
      const usuario = await Usuario.findOne({ documento: value }).lean().exec()
      if (usuario) {
        return Promise.reject('Documento ya esta registrado')
      }
    }),
  //NOMBRES
  // Que el name exista, no se encuentre vacio y que no sea menor a 2 digitos
  check('nombres', 'Los nombres del usuario es Requerido')
    .exists()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('Los Nombres no puede ser menor a 2 caracteres'),
  //APELLIDOS
  // Que el lastName exista, no se encuentre vacio y que no sea menor a 2 digitos
  check('apellidos', 'Los Apellidos del usuario es Requerido')
    .exists()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('Los Apellidos no puede ser menor a 2 caracteres'),

  (req, res, next) => {
    validacionErrores(req, res, next)
  }
]
