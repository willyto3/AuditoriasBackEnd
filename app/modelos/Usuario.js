//? IMPORTACION DE DEPENDENCIAS

// Importación de Mongoose
import mongoose from 'mongoose'

// Se crea el Esquema para el Usuario
const UsuarioEsquema = new mongoose.Schema(
  {
    nombres: { type: String, required: true, min: 2, max: 50 },
    apellidos: { type: String, required: true, min: 2, max: 50 },

    documento: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      unique: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    contrasena: {
      type: String,
      required: true,
      min: 5
    },
    cargo: {
      type: String,
      enum: ['Auditor', 'Auditor Líder'],
      default: 'Auditor'
    },
    picturePath: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Se crea la constante User basada en el esquema UserSchema
const Usuario = mongoose.model('Usuario', UsuarioEsquema)

// Se exporta User
export default Usuario
