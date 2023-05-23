//? IMPORTACION DE PAQUETES
// Importación de Express
import express from 'express'
// Importación de Path
import path from 'path'

//? IMPORTACIÓN DE MODULOS
// Importación de fileDirName
import fileDirName from '../../configuracion/file-dir-name.js'

// Se declara la ruta y el nombre del archivo
const { __dirname, __filename } = fileDirName(import.meta)

// Se declara el router
const router = express.Router()

// Cuando se ingresa a nuestro API, muestra la pagina index.html
router.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'paginas', 'index.html'))
})

export default router
