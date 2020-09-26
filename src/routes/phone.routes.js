const express = require('express')
const router = express.Router()
const phoneController = require('../controllers/phone.controller')

const {
  verifyToken,
  isAdmin
} = require('../middlewares/auth')
const {
  checkAddPhone
} = require('../middlewares/formErrorHandling')

router
  .get('/', verifyToken, isAdmin, phoneController.getAllPhone)
  .get('/my-phone', verifyToken, phoneController.getMyPhone)
  .get('/primary', verifyToken, phoneController.getPrimaryPhone)
  .patch('/select/:id', verifyToken, phoneController.selectPrimary)
  .post('/', verifyToken, checkAddPhone, phoneController.addPhone)
  .delete('/:id', verifyToken, phoneController.deletePhone)

module.exports = router