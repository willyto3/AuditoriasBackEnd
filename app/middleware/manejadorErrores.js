//? IMPORTACIÓN DE MODULOS
// Importación de Colors
import colors from 'colors'

// Importacion de registroEventos
import { registroEventos } from './registroEventos.js'

// Funcion para crear y guardar un Error
export const ManejadorErrores = (err, req, res, next) => {
  registroEventos(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  )
  console.log(colors.red(err.stack))

  const status = res.statusCode ? res.statusCode : 500

  res.status(status)

  res.json({ message: err.message })
}
