//? IMPORTACION DE DEPENDENCIAS
// Importación de Multer
import multer from 'multer'

//? GUARDADO DE ARCHIVOS

// Función para guardar los archivos a la carpeta public/assets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/assets"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  // filename: function (req, file, cb) {
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  //   cb(
  //     null,
  //     file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
  //   )
  // }
});

export const upload = multer({ storage: storage });
