//? IMPORTACION DE PAQUETES
// Se importa BcryptJS
import bcryptjs from 'bcryptjs'
// Se importa JSONWebToken
import jwt from 'jsonwebtoken'
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

//? IMPORTACION DE MODELOS
// Importacón del Modelo User
import Usuario from '../modelos/Usuario.js'

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
    return res.status(401).json({
      ok: false,
      mensaje: 'El Email o la Contraseña no estan Registrados'
    })
  }

  if (!usuario.estaActivo) {
    return res
      .status(401)
      .json({ ok: false, message: 'El Usuario no se Encuentra Activo.' })
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

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: usuario.email,
        rol: usuario.rol,
        _id: usuario._id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        documento: usuario.documento,
        cargo: usuario.cargo,
        picturePath: usuario.picturePath,
        estaActivo: usuario.estaActivo,
        createdAt: usuario.createdAt,
        updatedAt: usuario.updatedAt
      }
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { email: usuario.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )

  // Crear Cookie segura
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 100
  })

  res.json({
    ok: true,
    mensaje: `Se Inicio la Sesión del Usuario ${usuario.nombres}`,
    accessToken
  })
})

//? REFRESCAR TOKEN
// @Descripción Refrescar el token
// @route GET /auth/refresh
// @Acceso Publico - Por que el Token Expiro
export const refresh = (req, res) => {
  const cookies = req.cookies

  console.log(cookies)

  if (!cookies?.jwt)
    return res.status(401).json({ ok: false, message: 'No esta Autorizado' })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ ok: false, message: 'Forbidden' })

      const usuario = await Usuario.findOne({ email: decoded.email })

      if (!usuario)
        return res
          .status(401)
          .json({ ok: false, message: 'No esta Autorizado' })

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: usuario.email,
            rol: usuario.rol
          }
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '15m' }
      )

      res.json({ accessToken })
    })
  )
}

//? LOGOUT
// @Descripción Eliminar datos del usuario
// @route GET /auth/logout
// @Acceso Publico - Para limpiar todas las cookies
export const logout = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ ok: true, message: 'Cookie Eliminada' })
}
