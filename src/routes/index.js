const express = require('express')

const routeUser = require('./user.routes')
const routeAuth = require('./auth.routes')
const router = express.Router()

router
  .use('/users', routeUser)
  .use('/auth', routeAuth)

module.exports = router