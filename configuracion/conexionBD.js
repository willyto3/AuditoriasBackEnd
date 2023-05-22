// Importación de Mongoose
import mongoose from 'mongoose'

//Funcion para conectar a la base de Datos
export const conexionBD = async () => {
  // Conexion a la base de datos
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      dbName: 'Auditoria'
    })
    // Captura de Errores
  } catch (err) {
    console.log(err.red)
  }
}
