// Importacion del modulo AllowedOrigins
import {modificadoresPermitidos} from './ModificadoresPermitidos.js'

// Configuracion de Cors para solo permitir el ingreso de las paginas permitidas
export const opcionesCors = {
  origin: (origin, callback) => {
    if (modificadoresPermitidos.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('El Ingreso esta Bloqueado por CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}
