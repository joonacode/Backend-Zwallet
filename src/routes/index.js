const express = require('express')

const routeUser = require('./user.routes')
const routeAuth = require('./auth.routes')
const routerPhone = require('./phone.routes')
const routerHistory = require('./history.routes')
const router = express.Router()

router
  .use('/users', routeUser)
  .use('/phones', routerPhone)
  .use('/histories', routerHistory)
  .use('/auth', routeAuth)

module.exports = router