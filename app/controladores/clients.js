//? IMPORTACION DE PAQUETES
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

//? IMPORTACION DE MODELOS
// Importacón del Modelo User
import Client from '../modelos/Client.js'
import Usuario from '../modelos/Usuario.js'

//? OBTENER CLIENTES
// @Descripcion obtener todos los Clientes
// @route Get /Clientes
// @Acceso Privado
export const getAllClients = asyncHandler(async (req, res) => {
  // Se añade poder enviar por req.query, metodos para filtar resultados y ordenar resultados
  const { name, sort, select } = req.query
  const queryObject = {}

  // Busqueda por Nombres
  if (name) {
    queryObject.name = name
  }

  // Se buscan todos los clientes,
  let clientsData = Client.find(queryObject)

  // Se ordena por eleccion del usuario
  if (sort) {
    let sortFix = sort.replace(',', ' ')
    clientsData = clientsData.sort(sortFix)
  }

  // Para retornar unicamente los datos necesarios de los usuarios
  if (select) {
    let selectFix = select.split(',').join(' ')
    clientsData = clientsData.select(selectFix)
  }

  // Para añadir paginacion a la busqueda
  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10
  let skip = (page - 1) * limit
  clientsData = clientsData.skip(skip).limit(limit)

  // Se buscan todos los clientes
  const clients = await Client.find().lean()

  // Si el arreglo clientes esta vacio, muestra un mensaje de error
  if (!clients?.length) {
    return res
      .status(400)
      .json({ ok: false, mensaje: 'No se encontraron Clientes' })
  }
  // Respuesta de los clients encontrados
  res.json(clients)
})

// //? OBTENER UN USUARIO
// // @Descripcion obtener un usuario
// // @route Get /usuarios:id
// // @Acceso Privado
// export const obtenerUnUsuario = asyncHandler(async (req, res) => {
//   // Se extrae el id de los parametros
//   const { id: _id } = req.params

//   // Se realiza la busqueda del id en User
//   const usuario = await Usuario.findById(_id)
//   // Si el usuario esta vacio, muestra un mensaje de error
//   if (!usuario) {
//     return res.status(400).json({ ok: false, message: 'Usuario no encontrado' })
//   }
//   // Respuesta del usuario encontrado
//   res.json(usuario)
// })

//? REGISTRAR CLIENTE
// @Descripción Crear un nuevo Cliente
// @route Post clients
// @Acceso Privado
export const createClient = asyncHandler(async (req, res) => {
  console.log(req.body)
  // Se solicitan los datos de la pagina

  const { name, NIT, email, picturePath, createdBy, contact } = new Client(
    req.body
  )


  const _id = createdBy

  // Se verifica que el usuario que este grabando el cliente exista en la base de datos
  const searchUserById = await Usuario.findById({ _id })

  if (!searchUserById) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El ID del Auditor no se encuentra registrado.'
    })
  }

  // Se verifica que no haya un usuario con ese email
  const searchClientName = await Client.findOne({ name })

  if (searchClientName) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Ya se encuentra registrado un Clinte con ese nombre'
    })
  }

  // Se verifica que no haya un usuario con ese documento
  const searchNIT = await Client.findOne({ NIT })

  if (searchNIT) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El Documento ya se encuentra Registrado'
    })
  }

  // Se crea un objeto con los datos del cliente
  const newClient = {
    name,
    NIT,
    email,
    picturePath,
    createdBy,
    contact
  }

  // Se guarda el client
  const client = await Client.create(newClient)

  console.log(client)

  if (!client) {
    res
      .status(400)
      .json({ ok: false, mensaje: 'Error al registrar un nuevo cliente' })
  }

  res.status(200).json({
    ok: true,
    mensaje: `Se creo el nuevo cliente: ${name} con NIT: ${NIT}`
  })
})

//? ELIMINAR USUARIO

// @Descripcion Eliminar un usuario
// @route delete /usuarios/:id
// @Acceso Privado
//! Hay que pensar si se debe eliminar un usuario
//! HE PENSADO QUE SE ELIMINE SI NO HA REALIZADO AUDITORIAS
export const eliminarUsuario = asyncHandler(async (req, res) => {
  // Se extrae el id de los parametros
  const { id: _id } = req.params

  if (!_id) {
    return res.status(400).json({ message: 'Se requiere el ID del Usuario' })
  }

  // const sample = await Sample.findOne({ user: id }).lean().exec()
  // if (note) {
  //   return res
  //     .status(400)
  //     .json({
  //       message: 'El Usuario ha realizado Analisis no se puede eliminar'
  //     })
  // }

  const usuario = await Usuario.findById(_id).exec()

  if (!usuario) {
    return res.status(400).json({ message: 'Usuario no Encontrado' })
  }

  const result = await usuario.deleteOne()

  const reply = `Se elimino el usuario ${result.nombres} ${result.apellidos}.`
  res.json(reply)
})

//? UPDATE USER
// @Descripcion Actualizar un Usuario
// @route Patch /usuarios/:id
// @Acceso Privado
export const actualizarUsuario = asyncHandler(async (req, res) => {
  // Se extrae el id de los parametros
  const { id: _id } = req.params
  // Se solicitan los datos de la pagina
  const {
    nombres,
    apellidos,
    documento,
    email,
    cargo,
    picturePath,
    rol,
    estaActivo
  } = req.body

  // se verifica que exista un id de un usuario
  if (!_id) {
    return res.status(400).json({
      ok: false,
      message: 'Se Necesita el ID del usuario a actualizar'
    })
  }

  // Se realiza la busqueda por el id del usuario
  const usuario = await Usuario.findById(_id).select('-contrasena').exec()

  // Se verifica que el usuario exista
  if (!usuario) {
    return res.status(400).json({ ok: false, message: 'Usuario no encontrado' })
  }

  //Check for duplicate
  const duplicate = await Usuario.findOne({ documento }).lean().exec()
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== _id) {
    return res.status(409).json({ ok: false, message: 'Usuario ya Registrado' })
  }

  usuario.nombres = nombres
  usuario.apellidos = apellidos
  usuario.email = email
  usuario.documento = documento
  usuario.estaActivo = estaActivo
  usuario.picturePath = picturePath
  usuario.cargo = cargo
  usuario.rol = rol

  const usuarioActualizado = await usuario.save()
  res.status(200).json({
    ok: true,
    message: `Se Actualizo el Usuario ${usuarioActualizado.nombres} ${usuarioActualizado.apellidos}`,
    usuarioActualizado
  })
})
