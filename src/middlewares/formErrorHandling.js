const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const userModels = require('../models/user.model')


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
  checkChangePassword: (req, res, next) => {
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
  }

}

module.exports = checkForm