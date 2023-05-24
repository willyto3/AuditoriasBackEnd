//? IMPORTACION DE PAQUETES
// Se importa express rate limit
import rateLimit from 'express-rate-limit'

//? IMPORTACIÓN DE MODULOS
// Importacion de registroEventos
import { registroEventos } from './registroEventos.js'

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      'Muchos Intentos de Registro de Usuario de esta IP, Por favor intente más tarde de nuevo'
  },
  handler: (req, res, next, options) => {
    registroEventos(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog.log'
    )
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false
})
