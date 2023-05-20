// ? IMPORTACIÓN DE PAQUETES
// Importación de Express
import express from 'express'

// //? IMPORTACIÓN DE MODULOS
// Importacion del modulo para subir archivos
import { upload } from '../middleware/manejadorArchivos.js'

//? IMPORTACION DEL CONTROLADOR
// Se importa el controlador del cliente
import {
  eliminarUsuario,
  getAllClients,
  createClient,
  actualizarUsuario
} from '../controladores/clients.js'

// Se declara el router
const router = express.Router()

// Se utilizan las Rutas
// Rutas de Lectura
router.get('/', getAllClients)
// router.get('/:id', getAClient)

// // Rutas de Eliminación
// router.delete('/:id', deleteClient)

// Rutas de Escritura
router.post('/', upload.single('picture'), createClient)

// // Rutas de Actualización
// router.patch('/:id', updateClient)

export default router
