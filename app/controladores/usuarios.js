//? IMPORTACION DE DEPENDENCIAS
// Se importa BcryptJS
import bcryptjs from 'bcryptjs'
// Se importa JSONWebToken
import jwt from 'jsonwebtoken'
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

//? IMPORTACION DE MODELOS
// Importacón del Modelo User
import Usuario from '../modelos/Usuario.js'

//? OBTENER USUARIOS
// @Descripcion obtener todos los usuarios
// @route Get /usuarios
// @Acceso Privado
export const obtenerTodosLosUsuarios = asyncHandler(async (req, res) => {

  // Se añade poder enviar por req.query, metodos para filtar resultados y ordenar resultados
  const { nombres, sort, select } = req.query
  const queryObject = {}

    // Busqueda por Nombres
  if (nombres) {
    queryObject.nombres = nombres
  }

  // Se buscan todos los usuarios, pero no se solicita la informacion del password
  let usersData = Usuario.find(queryObject)

  // Se ordena por eleccion del usuario
  if (sort) {
    let sortFix = sort.replace(',', ' ')
    usersData = usersData.sort(sortFix)
  }

  // Para retornar unicamente los datos necesarios de los usuarios
  if (select) {
    let selectFix = select.split(',').join(' ')
    usersData = usersData.select(selectFix)
  }

  // Para añadir paginacion a la busqueda
  let page = Number(req.query.page) || 1
  let limit = Number(req.query.limit) || 10
  let skip = (page - 1) * limit
  usersData = usersData.skip(skip).limit(limit)

  // Se buscan todos los usuarios, pero no se solicita la informacion del password
  const usuarios = await Usuario.find().select('-contrasena').lean()

  // Si el arreglo usuario esta vacio, muestra un mensaje de error
  if (!usuarios?.length) {
    return res
      .status(400)
      .json({ ok: false, mensaje: 'No se encontraron Usuarios' })
  }
  // Respuesta de los usuarios encontrados
  res.json(usuarios)
})

// OBTENER UN USUARIO
// @Descripcion obtener un usuario
// @route Get /usuarios:id
// @Acceso Privado
export const obtenerUnUsuario = asyncHandler(async (req, res) => {
  // Se extrae el id de los parametros
  const { id: _id } = req.params

  // Se realiza la busqueda del id en User
  const usuario = await Usuario.findById(_id)
  // Si el usuario esta vacio, muestra un mensaje de error
  if (!usuario) {
    return res.status(400).json({ ok: false, message: 'Usuario no encontrado' })
  }
  // Respuesta del usuario encontrado
  console.log(usuario)
  res.json(usuario)
})

//? INGRESO USUARIO
// @Descripción Hacer Login en la APP
// @route Post usuarios/ingresousuario
// @Acceso Publico
export const ingresoUsuario = asyncHandler(async (req, res) => {
  // Se solicitan los datos de la pagina
  const { email, contrasena } = req.body

  // Se busca el usuario en la Base de datos
  const usuario = await Usuario.findOne({ email })

  if (!usuario) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El Email o la Contraseña no estan Registrados'
    })
  }

  // Se compara la contraseña ingresada con la contraseña en la base de datos
  const compararContrasena = await bcryptjs.compareSync(
    contrasena,
    usuario.contrasena
  )

  if (!compararContrasena) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El Email o la Contraseña no estan Registrados'
    })
  }

  const payload = {
    id: usuario._id
  }

  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: 360000 },
    (error, token) => {
      if (error) res.json({ error })

      res.json({
        ok: true,
        mensaje: `Se Inicio la Sesión del Usuario ${usuario.nombres}`,
        usuario,
        token
      })
    }
  )
})

//? REGISTRAR USUARIO
// @Descripción Crear un nuevo usuario
// @route Post usuarios
// @Acceso Privado
export const registroUsuario = asyncHandler(async (req, res) => {
  // Se solicitan los datos de la pagina
  const {
    nombres,
    apellidos,
    documento,
    email,
    contrasena,
    cargo,
    picturePath
  } = req.body

  // Se verifica que no haya un usuario con ese email
  const busquedaUsuario = await Usuario.findOne({ email })

  if (busquedaUsuario) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El Correo Electronico ya se encuentra Registrado'
    })
  }

    // Se verifica que no haya un usuario con ese documento
    const busquedaDocumento = await Usuario.findOne({ documento })

    if (busquedaDocumento) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El Documento ya se encuentra Registrado'
      })
    }

  // Se realiza la proteccion del password
  const salt = bcryptjs.genSaltSync(12)
  const contrasenaProtegida = await bcryptjs.hashSync(contrasena, salt)

  // Se crea un objeto con los datos del usuario
  const nuevoUsuario = {
    nombres,
    apellidos,
    documento,
    email,
    contrasena: contrasenaProtegida,
    cargo,
    picturePath
  }

  // Se guarda el usuario
  const usuario = await Usuario.create(nuevoUsuario)

  console.log(usuario)

  if (!usuario) {
    res
      .status(400)
      .json({ ok: false, mensaje: 'Error al registrar un nuevo usuario' })
  }

  res.status(200).json({
    ok: true,
    mensaje: `Se creo el nuevo usuario: ${nombres} ${apellidos}`
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