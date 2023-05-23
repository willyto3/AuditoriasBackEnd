//? IMPORTACIÓN DE MODULOS
// Importación de Colors
import colors from 'colors'

// Importacion de registroEventos
import { registroEventos } from './registroEventos.js'

import { constants } from '../../configuracion/constants.js'

// Funcion para crear y guardar un Error
export const ManejadorErrores = (err, req, res, next) => {
  registroEventos(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  )
  console.log(colors.red(err.stack))

  const statusCode = res.statusCode ? res.statusCode : 500

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: 'Validation Failed',
        message: err.message,
        stackTrace: err.stack
      })
      break
    case constants.NOT_FOUND:
      res.json({
        title: 'Not Found',
        message: err.message,
        stackTrace: err.stack
      })
    case constants.UNATHORIZED:
      res.json({
        title: 'Unauthorized',
        message: err.message,
        stackTrace: err.stack
      })
    case constants.FORBIDDEN:
      res.json({
        title: 'Forbidden',
        message: err.message,
        stackTrace: err.stack
      })
    case constants.SERVER_ERROR:
      res.json({
        title: 'Server Error',
        message: err.message,
        stackTrace: err.stack
      })
    default:
      console.log('No Error')
      break
  }

  res.status(statusCode)
}
