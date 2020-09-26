const express = require('express')
const router = express.Router()
const historyController = require('../controllers/history.controller')
const uploadFile = require('../middlewares/multer')
const {
  checkTransfer,
  checkTopup,
  checkReqResetPassword,
  checkResetPassword
} = require('../middlewares/formErrorHandling')

const {
  isAdmin,
  verifyToken
} = require('../middlewares/auth')

router
  .get('/', verifyToken, isAdmin, historyController.getAllHistory)
  .get('/get-topup', verifyToken, isAdmin, historyController.getAllTopup)
  .get('/my-history', verifyToken, historyController.getMyHistory)
  .post('/transfer', verifyToken, checkTransfer, historyController.transfer)
  .post('/topup', verifyToken, uploadFile, checkTopup, historyController.topup)
  .patch('/status-topup/:id', verifyToken, isAdmin, historyController.changeStatusTopUp)
  // .post('/login', checkLogin, historyController.login)
  // .post('/verify-account', historyController.verifyAccount)
  // .post('/request-reset-password', checkReqResetPassword, historyController.requestResetPassword)
  // .post('/verify-reset-password', historyController.verifyResetPassword)
  // .post('/reset-password', checkResetPassword, historyController.resetPassword)
  .get('/:id', verifyToken, historyController.detailHistory)

module.exports = router