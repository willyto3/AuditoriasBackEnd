//? IMPORTACION DE PAQUETES
// Importación de Express
import express from 'express'

// //? IMPORTACIÓN DE MODULOS
// Importacion del login limiter
import { loginLimiter } from '../middleware/LoginLimiter.js'

//? IMPORTACION DEL CONTROLADOR
// Se importa el controlador del usuario
import { logout, refresh, ingresoUsuario } from '../controladores/auth.js'

// Se declara el router
const router = express.Router()

// Se utilizan las Rutas

// Rutas de Escritura
router.post('/', loginLimiter, ingresoUsuario)

router.post('/logout', logout)

// Rutas de Lectura
router.get('/', refresh)

export default router
