//? IMPORTACION DE PAQUETES
// Importación de Express
import express from 'express'

// //? IMPORTACIÓN DE MODULOS
// Importación de Verificación de Token
import { verificarToken } from '../middleware/verificarToken.js'
// Importacion del modulo para subir archivos
import { upload } from '../middleware/manejadorArchivos.js'
// Importacion de Validar registro de un usuario
import { validarRegistro } from '../validaciones/usuarios.js'

//? IMPORTACION DEL CONTROLADOR
// Se importa el controlador del usuario
import {
  eliminarUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  registroUsuario,
  actualizarUsuario
} from '../controladores/usuarios.js'

// Se declara el router
const router = express.Router()

// Se utilizan las Rutas

// Rutas Protegidas
router.use(verificarToken)
// Rutas de Lectura
router.get('/', obtenerTodosLosUsuarios)
router.get('/:id', obtenerUnUsuario)

// Rutas de Eliminación
router.delete('/:id', eliminarUsuario)

// Rutas de Escritura
router.post('/', upload.single('picture'), registroUsuario)

// Rutas de Actualización
router.patch('/:id', actualizarUsuario)

export default router
