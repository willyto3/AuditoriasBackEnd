//? IMPORTACION DE PAQUETES
// Se importa JSONWebToken
import jwt from 'jsonwebtoken'
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

export const verificarToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no Valido'
    })
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401)
      throw new Error('Usuario no se encuentra Autorizado')
    }
    req.usuario = decoded.UserInfo.email
    req.rol = decoded.UserInfo.rol
    next()
  })
})
