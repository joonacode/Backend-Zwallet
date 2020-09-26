const bcrypt = require('bcrypt')
const saltRounds = 12
const helpers = require('../helpers/helpers')
const userModels = require('../models/user.model')
const tokenModels = require('../models/token.model')
var jwt = require('jsonwebtoken')

let tokenList = {}
const auth = {
  signup: async (req, res) => {
    const {
      username,
      email,
      password
    } = req.body

    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const newUser = {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hash,
          roleId: 2,
          status: 0,
        }
        userModels
          .signup(newUser)
          .then((response) => {
            // Token for verify email
            const token = jwt.sign({
                data: response.insertId,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '3h',
              },
            )
            userModels
              .getUserById(response.insertId)
              .then((responseUser) => {
                tokenModels
                  .sendToken({
                    token,
                    userId: response.insertId,
                    type: 1
                  })
                  .then((resToken) => console.log(`Token send to ${email}`))
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
            // const mailinfo = {
            //   from: 'joonacode@gmail.com',
            //   to: email,
            //   subject: 'Activate Account Zwallet',
            //   html: `<p>
            //         Click this link to <strong>activate</strong> your account: <a href="${process.env.BASE_URL_ACTIVATE}?token=${token}" target="_blank">Activate</a>
            //       </p>
            //       <small>link expires in 3 hours</small>`,
            // }
            // helpers.transporter(mailinfo, () => {

            // })
          })
          .catch((error) => {
            helpers.response(res, [], 400, error, true)
          })
      })
    })
  },

  login: (req, res) => {
    const {
      email,
      password
    } = req.body
    userModels
      .login(email)
      .then((response) => {
        const user = response[0]
        if (user.status === 0) return helpers.response(res, [], 404, 'Your account has not been activated, please check your email to activate', true)
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            helpers.redisInstance().del('getDetailUser')
            const newResponse = {
              id: user.id,
              roleId: user.roleId,
            }
            var token = jwt.sign({
                data: newResponse,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '5h',
              },
            )
            newResponse.token = token
            helpers.redisInstance().del('getAllUsers')
            helpers.response(
              res,
              newResponse,
              res.statusCode,
              'Login success'
            )
          } else {
            helpers.response(res, [], 400, 'Wrong email or password', true)
          }
        })
      })
      .catch((error) => {
        helpers.response(res, [], error.statusCode, 'Wrong email or password', true)
      })
  },

  verifyAccount: (req, res) => {
    const token = req.body.token
    if (!token) return helpers.response(res, [], 400, 'No token provided', true)
    tokenModels.findToken(token).then(response => {
      const {
        token,
        userId,
        type
      } = response[0]
      if (type !== 1) return helpers.response(res, [], 400, 'Wrong token', true)
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, 'Token invalid', true)
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            userModels.deleteUser(userId).then(deleteUsrResponse => console.log('usr deleted'))
            return helpers.response(res, [], 401, 'Token expired, please register again', true)
          } else {
            return helpers.response(res, [], 401, err, true)
          }
        } else {
          tokenModels.activateAccount(decoded.data).then(responseActivate => {
            helpers.response(
              res,
              responseActivate,
              res.statusCode,
              'Account successfully activate'
            )
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
          })
        }
      })
    }).catch(err => {
      helpers.response(res, [], 401, 'Token invalid', true)
    })
  },

  requestResetPassword: (req, res) => {
    const {
      email
    } = req.body

    userModels
      .getUserByEmail(email)
      .then((responseUser) => {
        const resultUser = responseUser[0]
        tokenModels.checkTokenExist(resultUser.id, 2).then((resToken) => {
            helpers.response(res, [], 400, 'The link to change the password has been sent to your email.', true)
          })
          .catch((errToken) => {
            const token = jwt.sign({
                data: email,
              },
              process.env.PRIVATE_KEY, {
                expiresIn: '3h',
              },
            )

            const mailinfo = {
              from: 'joonacode@gmail.com',
              to: email,
              subject: 'Reset Password Toko Fuku',
              html: `
              <center>
              <h1>Request to Reset Your Account Password</h1>
              <p>The link below is only valid for 3 hours after this email has entered your Inbox. If you do not wish to change your account password, do not ignore this email.</p>
              <br>
              <a href="${process.env.BASE_URL_RESET_PASSWORD}?token=${token}" target="_blank">Reset Password</a>
              </center>`,
            }
            helpers.transporter(mailinfo, () => {
              userModels
                .getUserByEmail(email)
                .then((responseUser) => {
                  const resultUser = responseUser[0]
                  delete resultUser.password
                  tokenModels
                    .sendToken({
                      token,
                      userId: resultUser.id,
                      type: 2
                    })
                    .then((resToken) => console.log(`Token send to ${email}`))
                  helpers.response(
                    res,
                    [email],
                    res.statusCode,
                    'Token successfully sent'
                  )
                })
                .catch((err) => {
                  helpers.response(res, [], err.statusCode, err, true)
                })
            })
          })
      })
      .catch((err) => {
        helpers.response(res, [], err.statusCode, err, true)
      })
  },

  verifyResetPassword: (req, res) => {
    const token = req.body.token
    if (!token) return helpers.response(res, [], 400, 'No token provided', true)
    tokenModels.findToken(token).then(response => {
      const {
        token,
        userId,
        type
      } = response[0]
      if (type !== 2) return helpers.response(res, [], 400, 'Wrong Token', true)
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, 'Token invalid', true)
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            return helpers.response(res, [], 401, 'Token expired, please request reset password again', true)
          } else {
            return helpers.response(res, [], 401, err, true)
          }
        } else {
          helpers.response(res, ['ok'], 200, 'Request reset password ok')
        }
      })
    }).catch(err => {
      helpers.response(res, [], 400, 'Token invalid', true)
    })
  },
  resetPassword: (req, res) => {
    const {
      password,
      token
    } = req.body
    if (!token) return helpers.response(res, [], 400, 'No token provided', true)
    tokenModels.findToken(token).then(response => {
      const {
        token,
        userId,
        type
      } = response[0]
      if (type !== 2) return helpers.response(res, [], 400, 'Wrong Token', true)
      jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
        if (err) {
          if (err.name === 'JsonWebTokenError') {
            return helpers.response(res, [], 401, 'Token invalid', true)
          } else if (err.name === 'TokenExpiredError') {
            tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
            return helpers.response(res, [], 401, 'Token expired, please request reset password again', true)
          } else {
            return helpers.response(res, [], 401, err, true)
          }
        } else {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              userModels.updateUser({
                  password: hash
                }, userId)
                .then(responseUser => {
                  tokenModels.deleteToken(token).then(deleteResponse => console.log('token deleted'))
                  helpers.response(res, ['ok'], 200, 'Password updated')
                }).catch(err => {
                  helpers.response(res, [], err.statusCode, err, true)
                })
            })
          })
        }
      })
    }).catch(err => {
      helpers.response(res, [], 400, 'Token invalid', true)
    })

  },

}

module.exports = auth