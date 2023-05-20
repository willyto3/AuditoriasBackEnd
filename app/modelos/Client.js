//? IMPORTACION DE PAQUETES
// Importación de Mongoose
import mongoose, { Schema } from 'mongoose'

// Se crea el esquema para los contactos del cliente
const contactSchema = new mongoose.Schema(
  {
    firtsName: { type: String, min: 2, max: 50 },
    lastName: { type: String, min: 2, max: 50 },
    contactEmail: {
      type: String,
      max: 50
    },
    phoneNumber: {
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Se crea el Esquema para los Clientes
const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 50, unique: true },
    NIT: {
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
    picturePath: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario'
    },
    contact: [contactSchema]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Se crea la constante User basada en el esquema UserSchema
const Client = mongoose.model('Client', ClientSchema)

// Se exporta User
export default Client
