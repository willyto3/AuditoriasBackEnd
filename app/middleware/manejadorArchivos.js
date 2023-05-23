//? IMPORTACION DE DEPENDENCIAS
// Importación de Multer
import multer from 'multer'
// Importación de Path
import path from 'path'

//? IMPORTACIÓN DE MODULOS

// Importación de fileDirName
import fileDirName from '../../configuracion/file-dir-name.js'

// Se declara la ruta y el nombre del archivo
const { __dirname, __filename } = fileDirName(import.meta)

//? GUARDADO DE ARCHIVOS

// Función para guardar los archivos a la carpeta public/assets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/assets'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage })
