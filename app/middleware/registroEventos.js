//? IMPORTACION DE DEPENDENCIAS

// Importacion de Date-fns
import { format } from 'date-fns'
// Importacion de UUID
import { v4 as uuidv4 } from 'uuid'
// Importacion de File System
import fs from 'fs'
// Importacion de File System Promesas
import fsPromises from 'fs/promises'
// Importación de Path y Join
import path from 'path'

//? IMPORTACIÓN DE MODULOS

// Importación de fileDirName
import fileDirName from '../../configuracion/file-dir-name.js'

//? CONFIGURACIONES

// Se declara el archivo y el nombre
const { __dirname, __filename } = fileDirName(import.meta)

// Funcion para crear un evento
export const registroEventos = async (mensaje, nombreArchivoRegistro) => {
  // Asignamos el formato a la fecha
  const fecha = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  //Asignamos el formato al registro
  const itemRegistrado = `${fecha}\t${uuidv4()}\t${mensaje}\n`

  try {
    // Comprobamos que exista el archivo y si no existe lo creamos
    if (!fs.existsSync(path.join(__dirname, '..', 'registros'))) {
      await fsPromises.mkdir(__dirname, '..', 'registros')
    }
    //Si el archivo existe, añadimos el registro al archivo
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'registros', nombreArchivoRegistro),
      itemRegistrado
    )
    //Atrapamos cualquier error que pueda suceder
  } catch (err) {
    console.log(err)
  }
}
// Funcion para guardar un Evento
export const registrador = (req, res, next) => {
  // Se guarda el evento en el archivo <reqLog.log> en la carpeta <logs>
  registroEventos(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  next()
}
