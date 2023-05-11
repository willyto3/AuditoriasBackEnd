//? IMPORTACION DE DEPENDENCIAS
// Importación de Express
import express from 'express';

// //? IMPORTACIÓN DE MODULOS
// Importación de Verificación de Token
import { verificarToken } from '../middleware/verificarToken.js';
// Importacion del modulo para subir archivos
import { upload } from '../middleware/manejadorArchivos.js';
// Importacion de Validar registro de un usuario
import { validarRegistro } from '../validaciones/usuarios.js';

//? IMPORTACION DEL CONTROLADOR
// Se importa el controlador del usuario
import {
  eliminarUsuario,
  ingresoUsuario,
  obtenerTodosLosUsuarios,
  obtenerUnUsuario,
  registroUsuario
} from '../controladores/usuarios.js';

// Se declara el router
const router = express.Router();

// Se utilizan las Rutas
// Rutas de Lectura
router.get('/', obtenerTodosLosUsuarios);
// router.get('/', verificarToken, obtenerTodosLosUsuarios)
router.get('/:id', obtenerUnUsuario);
// router.get('/:id', verificarToken,obtenerUnUsuario)

// Rutas de Eliminación
router.delete('/', eliminarUsuario);

// Rutas de Escritura
router.post(
  '/registrousuario',
  validarRegistro,
  upload.single('picture'),
  registroUsuario
);

router.post('/ingresousuario', ingresoUsuario);

// // Rutas de Actualización
// router.patch('/:id', verifyToken, updateUser)

export default router;
