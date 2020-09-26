const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')
const bcrypt = require('bcrypt')

const checkForm = {
  checkSignup: (req, res, next) => {
    const {
      username,
      email,
      password
    } = req.body

    const newCheck = [{
        name: 'Username',
        value: username,
        type: 'string',
      },
      {
        name: 'Email',
        value: email,
        type: 'string',
      },
      {
        name: 'Password',
        value: password,
        type: 'string',
      }
    ]
    errorHandling(res, newCheck, async () => {
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email,
      )
      if (!checkEmail) {
        return helpers.response(res, [], 400, 'Invalid email', true)
      } else if (username.split(' ').length > 1) {
        return helpers.response(res, [], 400, 'Username cannot use spaces', true)
      } else if (password.length < 6) {
        return helpers.response(res, [], 400, 'Password min 6 character', true)
      } else {
        let isEmailExist
        let isUsernameExist
        try {
          const resEmail = await userModels.checkEmailExist(email.toLowerCase())
          const resUsername = await userModels.checkUsernameExist(username.toLowerCase())
          isEmailExist = resEmail[0].totalFound
          isUsernameExist = resUsername[0].totalFound
        } catch (error) {
          helpers.response(res, [], error.statusCode, error, true)
        }
        if (isUsernameExist > 0) {
          return helpers.response(res, [], 400, 'Username already exist', true)
        } else if (isEmailExist > 0) {
          return helpers.response(res, [], 400, 'Email already exist', true)
        } else {
          next()
        }
      }
    })
  },
  checkLogin: (req, res, next) => {
    const {
      email,
      password
    } = req.body
    const newCheck = [{
        name: 'Email',
        value: email,
        type: 'string',
      },
      {
        name: 'Password',
        value: password,
        type: 'string',
      },
    ]
    errorHandling(res, newCheck, () => {
      next()
    })
  },
  checkReqResetPassword: (req, res, next) => {
    const {
      email,
    } = req.body

    const newCheck = [{
      name: 'Email',
      value: email,
      type: 'string',
    }]

    errorHandling(res, newCheck, async () => {
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email,
      )
      if (!checkEmail) {
        return helpers.response(res, [], 400, 'Invalid email', true)
      } else {
        let isEmailExist = 0
        let emailStatus
        try {
          const resEmail = await userModels.checkEmailExist(email)
          const resStatus = await userModels.getUserByEmail(email)
          isEmailExist = resEmail[0].totalFound
          emailStatus = resStatus[0].status
        } catch (error) {
          return helpers.response(res, [], error.statusCode, 'Email not found', true)
        }
        if (isEmailExist < 1) {
          return helpers.response(res, [], 400, 'Email not found', true)
        } else if (emailStatus === 0) {
          return helpers.response(res, [], 400, 'Please activate your account before resetting the password', true)
        } else {
          next()

        }
      }

    })
  },
  checkResetPassword: (req, res, next) => {
    const {
      password,
      confirmPassword
    } = req.body
    const newCheck = [{
        name: 'Password',
        value: password,
        type: 'string',
      },
      {
        name: 'Confirmation Password',
        value: confirmPassword,
        type: 'string',
      }
    ]
    errorHandling(res, newCheck, async () => {
      if (password.length < 6) {
        return helpers.response(res, [], 400, 'New password min 6 character', true)
      } else if (confirmPassword.length < 6) {
        return helpers.response(res, [], 400, 'Confirmation password min 6 character', true)
      } else if (password !== confirmPassword) {
        return helpers.response(res, [], 400, 'New password not match with confirmation password', true)
      } else {
        next()
      }
    })
  },
  checkAddUser: (req, res, next) => {
    const {
      firstName,
      lastName,
      username,
      email,
      roleId,
      password
    } = req.body

    const newCheck = [{
        name: 'First Name',
        value: firstName,
        type: 'string',
      },
      {
        name: 'Last Name',
        value: lastName,
        type: 'string',
      }, {
        name: 'Username',
        value: username,
        type: 'string',
      },
      {
        name: 'Email',
        value: email,
        type: 'string',
      },
      {
        name: 'Role Id',
        value: roleId,
        type: 'number',
      },
      {
        name: 'Password',
        value: password,
        type: 'string',
      }
    ]
    errorHandling(res, newCheck, async () => {
      const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        email,
      )
      if (!checkEmail) {
        return helpers.response(res, [], 400, 'Invalid email', true)
      } else if (username.split(' ').length > 1) {
        return helpers.response(res, [], 400, 'Username cannot use spaces', true)
      } else if (password.length < 6) {
        return helpers.response(res, [], 400, 'Password min 6 character', true)
      } else if (roleId !== '1' && roleId !== '2') {
        return helpers.response(res, [], 400, 'Role id not found', true)
      } else {
        let isEmailExist
        let isUsernameExist
        try {
          const resEmail = await userModels.checkEmailExist(email.toLowerCase())
          const resUsername = await userModels.checkUsernameExist(username.toLowerCase())
          isEmailExist = resEmail[0].totalFound
          isUsernameExist = resUsername[0].totalFound
        } catch (error) {
          helpers.response(res, [], error.statusCode, error, true)
        }
        if (isUsernameExist > 0) {
          return helpers.response(res, [], 400, 'Username already exist', true)
        } else if (isEmailExist > 0) {
          return helpers.response(res, [], 400, 'Email already exist', true)
        } else {
          next()
        }
      }
    })
  },
  checkChangePassword: (req, res, next) => {
    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body
    const newCheck = [{
        name: 'Current Password',
        value: currentPassword,
        type: 'string',
      },
      {
        name: 'New Password',
        value: newPassword,
        type: 'string',
      },
      {
        name: 'Confirmation Password',
        value: confirmPassword,
        type: 'string',
      }
    ]
    errorHandling(res, newCheck, async () => {
      if (newPassword.length < 6) {
        return helpers.response(res, [], 400, 'New password min 6 character', true)
      } else if (confirmPassword.length < 6) {
        return helpers.response(res, [], 400, 'Confirmation password min 6 character', true)
      } else if (newPassword !== confirmPassword) {
        return helpers.response(res, [], 400, 'New password not match with confirmation password', true)
      } else if (currentPassword === newPassword) {
        return helpers.response(res, [], 400, 'The new password must be different from the old password', true)
      } else {
        let password
        try {
          const user = await userModels.getUserById(req.userId)
          password = user[0].password
        } catch (err) {
          return helpers.response(res, [], 400, err, true)
        }
        bcrypt.compare(currentPassword, password, function (err, result) {
          if (!result) {
            return helpers.response(res, [], 400, 'old password wrong', true)
          } else {
            next()
          }
        });
      }
    })
  },
  checkSetPin: (req, res, next) => {
    const {
      pin
    } = req.body
    const newCheck = [{
      name: 'Pin',
      value: pin,
      type: 'number',
    }]
    errorHandling(res, newCheck, async () => {
      if (pin.length < 6) {
        return helpers.response(res, [], 400, 'The pin must be 6 characters', true)
      } else {
        next()
      }
    })
  },
  checkChangePin: (req, res, next) => {
    const {
      pin
    } = req.body
    const id = req.userId
    const newCheck = [{
      name: 'Current Pin',
      value: pin,
      type: 'number',
    }]
    errorHandling(res, newCheck, async () => {
      if (pin.length < 6) {
        return helpers.response(res, [], 400, 'The pin must be 6 characters', true)
      } else {
        try {
          const user = await userModels.getUserById(id)
          const response = user[0]
          if (response.pin !== pin) {
            return helpers.response(res, [], 400, 'Current pin wrong', true)
          } else {
            next()
          }
        } catch (err) {
          return helpers.response(res, [], 400, err, true)
        }
      }
    })
  },
  checkAddPhone: (req, res, next) => {
    const {
      phoneNumber
    } = req.body
    const newCheck = [{
      name: 'Phone Number',
      value: phoneNumber,
      type: 'number',
    }]
    errorHandling(res, newCheck, async () => {
      if (phoneNumber.length < 6) {
        return helpers.response(res, [], 400, 'Length phone number min 6', true)
      } else {
        next()
      }
    })
  },
  checkUpdateUser: (req, res, next) => {
    const {
      firstName,
      lastName,
      username,
    } = req.body

    const id = req.params.id

    const newCheck = [{
        name: 'First Name',
        value: firstName,
        type: 'string',
      },
      {
        name: 'Last Name',
        value: lastName,
        type: 'string',
      }, {
        name: 'Username',
        value: username,
        type: 'string',
      }
    ]
    errorHandling(res, newCheck, async () => {
      if (username.split(' ').length > 1) {
        return helpers.response(res, [], 400, 'Username cannot use spaces', true)
      } else {
        let isUsernameExist
        let currentUser = {}
        try {
          const resUsername = await userModels.checkUsernameExist(username.toLowerCase())
          const resCurrentUser = await userModels.getUserById(id)
          isUsernameExist = resUsername[0].totalFound
          currentUser = resCurrentUser[0]
        } catch (error) {
          helpers.response(res, [], error.statusCode, error, true)
        }
        if (currentUser.username !== username) {
          if (isUsernameExist > 0) {
            return helpers.response(res, [], 400, 'Username already exist', true)
          } else {
            next()
          }
        } else {
          next()
        }

      }
    })
  },
  checkTransfer: (req, res, next) => {
    const {
      receiverId,
      notes,
      amount,
      pin
    } = req.body
    const id = req.userId
    const newCheck = [{
      name: 'Receiver',
      value: receiverId,
      type: 'number',
    }, {
      name: 'Amount',
      value: amount,
      type: 'number',
    }, {
      name: 'Notes',
      value: notes,
      type: 'string',
    }]
    errorHandling(res, newCheck, async () => {
      if (amount < 5000) {
        return helpers.response(res, [], 400, 'Min transfer 5000', true)
      } else if (id === Number(receiverId)) {
        return helpers.response(res, [], 400, 'Recipient and sender must be different', true)
      } else {
        try {
          const checkAvailableUser = await userModels.getUserById(receiverId)
          const getUser = await userModels.getUserById(id)
          const currentUser = getUser[0]
          if (currentUser.balance < amount) {
            return helpers.response(res, [], 400, 'Your balance is lacking, please top up first', true)
          } else if (pin !== currentUser.pin) {
            return helpers.response(res, [], 400, 'Wrong pin', true)
          } else {
            next()
          }
        } catch (err) {
          return helpers.response(res, [], 400, 'Sender or receiver not found', true)
        }
      }
    })
  },
  checkTopup: (req, res, next) => {
    const {
      amount,
      image,
      pin
    } = req.body
    const id = req.userId
    const newCheck = [{
      name: 'Amount',
      value: amount,
      type: 'number',
    }]
    errorHandling(res, newCheck, async () => {
      if (amount < 5000) {
        return helpers.response(res, [], 400, 'Min topup 5000', true)
      } else if (!req.file) {
        return helpers.response(res, [], 400, 'Evidence of transfer required', true)
      } else {
        try {
          const getUser = await userModels.getUserById(id)
          const currentUser = getUser[0]
          if (pin !== currentUser.pin) {
            return helpers.response(res, [], 400, 'Wrong pin', true)
          } else {
            next()
          }
        } catch (err) {
          console.log(err)
          return helpers.response(res, [], 400, 'Sender or receiver not found', true)
        }
      }
    })
  }
}

module.exports = checkForm