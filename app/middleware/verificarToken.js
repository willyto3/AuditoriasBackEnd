//? IMPORTACION DE DEPENDENCIAS
// Se importa JSONWebToken
import jwt from 'jsonwebtoken'
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

export const verificarToken = asyncHandler(async (req, res, next) => {
  let token = req.header('Authorization')
  // const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no Valido'
    })
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft()
  }

  const verificado = jwt.verify(token, process.env.JWT_SECRET_KEY)
  req.usuario = verificado
  next()
})
