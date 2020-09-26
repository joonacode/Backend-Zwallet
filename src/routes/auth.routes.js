const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const {
  checkSignup,
  checkLogin,
  checkReqResetPassword,
  checkResetPassword
} = require('../middlewares/formErrorHandling')

router
  .post('/register', checkSignup, authController.signup)
  .post('/login', checkLogin, authController.login)
  .post('/verify-account', authController.verifyAccount)
  .post('/request-reset-password', checkReqResetPassword, authController.requestResetPassword)
  .post('/verify-reset-password', authController.verifyResetPassword)
  .post('/reset-password', checkResetPassword, authController.resetPassword)

module.exports = router