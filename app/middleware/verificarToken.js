//? IMPORTACION DE PAQUETES
// Se importa JSONWebToken
import jwt from 'jsonwebtoken'
// Se importa Express-Async-Handler
import asyncHandler from 'express-async-handler'

export const verificarToken = asyncHandler(async (req, res, next) => {
  let token = req.header.Authorization || req.header.authorization

  console.log(token)

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no Valido'
    })
  }

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1]
  }

  const verificado = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        res.status(401)
        throw new Error('Usuario no se encuentra Autorizado')
      }
      console.log(decoded)
    }
  )
  req.usuario = verificado
  next()
})
