const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')
const phoneModel = require('../models/phone.model')
const fs = require('fs')

const user = {
  getAllUser: (req, res) => {
    const id = req.userId
    if (!id) return helpers.response(res, [], 400, ['Id not found'], true)
    const order = req.query.order || 'DESC'
    userModels
      .getAllUser(id, order)
      .then((response) => {
        const newResponse = response
        helpers.response(res, newResponse, 200, helpers.status.found)
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },
  getMyProfile: (req, res) => {
    const id = req.userId
    userModels
      .getUserById(id)
      .then((response) => {
        const newRes = response[0]
        delete newRes.password
        helpers.response(res, newRes, 200, helpers.status.found)
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },
  getUserById: (req, res) => {
    const id = req.params.id
    userModels
      .getUserById(id)
      .then((response) => {
        const newRes = response[0]
        delete newRes.password
        helpers.response(res, newRes, 200, helpers.status.found2)
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },

  addUser: (req, res) => {
    const {
      firstName,
      lastName,
      username,
      email,
      roleId,
      password
    } = req.body
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const newUser = {
          firstName,
          lastName,
          username,
          email,
          roleId,
          password: hash,
          status: 1
        }
        userModels.signup(newUser).then(response => {
          userModels
            .getUserById(response.insertId)
            .then((responseUser) => {
              const resultUser = responseUser[0]
              delete resultUser.password
              helpers.response(
                res,
                resultUser,
                res.statusCode,
                helpers.status.insert
              )
            })
            .catch((err) => {
              helpers.response(res, [], err.statusCode, err, true)
            })
        }).catch((err) => {
          if (err.errno === 1452) {
            helpers.response(res, [], err.statusCode, 'Role id not found', true)
          } else {
            helpers.response(res, [], err.statusCode, err, true)
          }
        })
      })
    })
  },

  changePassword: (req, res) => {
    const {
      newPassword
    } = req.body
    const id = req.userId
    bcrypt.hash(newPassword, saltRounds, function (err, hash) {
      userModels.updateUser({
        password: hash
      }, id).then(response => {
        helpers.response(res, [], 200, 'Password changed successfully')
      }).catch(err => {
        helpers.response(res, [], err.statusCode, err, true)

      })
    });
  },

  setPin: (req, res) => {
    const {
      pin
    } = req.body
    const id = req.userId
    userModels.updateUser({
      pin
    }, id).then(response => {
      helpers.response(res, [], 200, 'Pin changed successfully')
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)

    })
  },

  changePin: (req, res) => {
    const {
      newPin
    } = req.body
    const id = req.userId
    if (!newPin) return helpers.response(res, [], 400, 'New pin required', true)
    if (newPin.length < 6) return helpers.response(res, [], 400, 'New pin must be 6 characters', true)
    userModels.updateUser({
      pin: newPin
    }, id).then(response => {
      helpers.response(res, [], 200, 'Pin changed successfully')
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },

  deleteUser: (req, res) => {
    const id = req.params.id
    phoneModel.deletePhoneByUser(id).then(resPhone => {
        console.log('ok')
      })
      .catch((err) => {
        console.log(err)
      })
    userModels
      .deleteUser(id)
      .then((response) => {
        helpers.response(res, [], 200, helpers.status.delete)
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },

  updateUser: (req, res) => {
    const {
      firstName,
      lastName,
      username,
    } = req.body
    const id = req.params.id

    if (req.uploadErrorMessage)
      return helpers.response(res, [], 400, req.uploadErrorMessage, true)
    const updateUser = {
      firstName,
      lastName,
      username: username.toLowerCase()
    }
    if (req.file) {
      updateUser.image = `${process.env.BASE_URL}/${req.file.path}`
    }
    userModels.updateUser(updateUser, id)
      .then(response => {
        helpers.response(res, [], 200, helpers.status.update)
      }).catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },
}

module.exports = user