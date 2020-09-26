const jwt = require('jsonwebtoken')
const helpers = require('../helpers/helpers')

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) return helpers.response(res, [], 403, 'No token provided', true)
  const token = req.headers.authorization.split(' ')[1]
  jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return helpers.response(res, [], 401, 'Token invalid', true)
      } else if (err.name === 'TokenExpiredError') {
        return helpers.response(res, [], 401, 'Token expired', true)
      } else {
        return helpers.response(res, [], 401, err, true)
      }
    }
    req.userId = decoded.data.id
    req.roleId = decoded.data.roleId
    next()
  })
}

const isAdmin = (req, res, next) => {
  if (req.roleId === 1) {
    next()
    return
  }
  return helpers.response(res, [], 403, 'Only admin can access', true)
}


const isAdminOrUer = (req, res, next) => {
  if (req.roleId === 2 || req.roleId === 1) {
    next()
    return
  }
  return helpers.response(res, [], 403, 'Only user and admin can access', true)
}

const auth = {
  verifyToken,
  isAdmin,
  isAdminOrUer
}

module.exports = auth