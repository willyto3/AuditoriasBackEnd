//? IMPORTACION DE DEPENDENCIAS
// Importación de Express
import express from 'express'
// Importación de Body Parser
import bodyParser from 'body-parser'
// Importación de Mongoose
import mongoose from 'mongoose'
// Importación de CORS
import cors from 'cors'
// Importación de DOTENV
import dotenv from 'dotenv'
// Importación de Helmet
import helmet from 'helmet'
// Importación de Morgan
import morgan from 'morgan'
// Importación de Path
import path from 'path'
// Importación de Colors
import colors from 'colors'

//? IMPORTACIÓN DE MODULOS
// Importación de fileDirName
import fileDirName from './configuracion/file-dir-name.js'
// Importacion del logger y logevents
import {
  registrador,
  registroEventos
} from './app/middleware/registroEventos.js'
// Importacion del errorHandler
import { ManejadorErrores } from './app/middleware/manejadorErrores.js'
// Importacion de la configuracion de Cors
import { opcionesCors } from './configuracion/opcionesCors.js'
// Importacion de la conexion a la base de datos
import { conexionBD } from './configuracion/conexionBD.js'
// // Importación de Verificación de Token
// import { verifyToken } from './app/middleware/auth.js'

//? IMPORTACIÓN DE RUTAS
import raizRutas from './app/rutas/raiz.js'
import usuarioRutas from './app/rutas/usuarios.js'
// import authRoutes from './app/routes/auth.js'

// import equipoRoutes from './app/routes/equipos.js'

//? CONFIGURACIONES

// Configuración del DOTENV
dotenv.config()
// Configuracion de la version de la API
const api = process.env.API_URL
// Se declara el puerto de trabajo
const PORT = process.env.PORT || 6001

// Se declara la ruta y el nombre del archivo
const { __dirname, __filename } = fileDirName(import.meta)

// se solicita la Conexion a la base de datos
conexionBD()

// Inicio de Express
const app = express()

//? MIDDLEWARE

// Codigo para poder usar el metodo logger
app.use(registrador)
// Codigo para poder usar documentos JSON
app.use(express.json())
// Codigo para poder usar Helmet
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
// Codigo para usar Cors
app.use(cors(opcionesCors))
// Codigo para usar Morgan
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms'
    ].join(' ')
  })
)
// Codigo para usar BodyParser
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
// Codigo para usar la carpeta publica de los archivos estaticos assets
app.use('/images', express.static(path.join(__dirname, 'public/assets')))

//? RUTAS
// Ruta Principal
app.use(`${api}/`, raizRutas)

//Rutas
app.use(`${api}/usuarios`, usuarioRutas)
// app.use(`${api}/auth`, authRoutes)
// app.use(`${api}/equipos`, equipoRoutes)

// Ruta 404
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, './app/paginas', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Pagina No Encontrada' })
  } else {
    res.type('txt').send('404 Pagina No Encontrada')
  }
})

//? GUARDADO DE ERRORES
// Codigo para poder usar el metodo errorHandler
app.use(ManejadorErrores)

// Imprimimos en Consola nuestro nivel de ejecución
console.log(process.env.NODE_ENV.rainbow)

//? CONEXIÓN A LA BASE DE DATOS
// Conexión a la Base de Datos
mongoose.connection.once('open', () => {
  app.listen(PORT, () =>
    console.log(
      `Nos Encontramos en el ${process.env.NODE_ENV} - Conectado a MongoDB - Server Corriendo en el puerto ${PORT}`
        .bgBrightGreen
    )
  )
})

// Manejo de errores al conectar a la base de datos
mongoose.connection.on('Error', (err) => {
  registroEventos(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  )
})
