const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const uploadFile = require('../middlewares/multer')

const {
  verifyToken,
  isAdmin
} = require('../middlewares/auth')
const {
  checkAddUser,
  checkChangePassword,
  checkSetPin,
  checkChangePin,
  checkUpdateUser
} = require('../middlewares/formErrorHandling')

router
  .get('/', verifyToken, userController.getAllUser)
  .post('/', verifyToken, isAdmin, checkAddUser, userController.addUser)
  .get('/profile', verifyToken, userController.getMyProfile)
  .patch('/change-password', verifyToken, checkChangePassword, userController.changePassword)
  .patch('/set-pin', verifyToken, checkSetPin, userController.setPin)
  .patch('/change-pin', verifyToken, checkChangePin, userController.changePin)
  .patch('/:id', verifyToken, uploadFile, checkUpdateUser, userController.updateUser)

  .delete('/:id', verifyToken, isAdmin, userController.deleteUser)
  .get('/:id', userController.getUserById)

module.exports = router