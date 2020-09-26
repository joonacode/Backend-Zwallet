const helpers = require('../helpers/helpers')
const phoneModels = require('../models/phone.model')
const userModels = require('../models/user.model')

const user = {
  getAllPhone: (req, res) => {
    phoneModels.getAllPhone().then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getMyPhone: (req, res) => {
    const id = req.userId
    phoneModels.getMyPhone(id).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getPrimaryPhone: (req, res) => {
    const id = req.userId
    phoneModels.getMyPrimaryPhone(id).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  selectPrimary: (req, res) => {
    const id = req.params.id
    const idUser = req.userId
    phoneModels.getPhoneById(id).then(response => {
      const detailPhone = response[0]
      if (detailPhone.userId !== idUser) {
        helpers.response(res, [], 400, 'You have no right', true)
      } else {
        if (Number(id) === detailPhone.id && detailPhone.status === 1) {
          helpers.response(res, [], 200, 'This phone number is primary')
        } else {
          phoneModels.getMyPrimaryPhone(idUser).then(response => {
            const primary = response[0]
            phoneModels.updatePhone({
              status: 0
            }, primary.id).then(responseChange => {
              console.log('ok')
            }).catch(err => {
              helpers.response(res, [], err.statusCode, err, true)
            })

            phoneModels.updatePhone({
              status: 1
            }, id).then(response => {
              helpers.response(res, [], 200, helpers.status.update)
            })

            userModels.updateUser({
              phoneNumber: detailPhone.phoneNumber
            }, idUser).then(resPhone => console.log('ok'))

          }).catch(err => {
            phoneModels.updatePhone({
              status: 1
            }, id).then(response => {
              userModels.updateUser({
                phoneNumber: detailPhone.phoneNumber
              }, idUser).then(resPhone => console.log('ok'))
            })
          })
        }
      }
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  addPhone: (req, res) => {
    const {
      phoneNumber
    } = req.body
    const id = req.userId
    const newPhone = {
      phoneNumber: phoneNumber,
      userId: id,
      status: 0
    }
    phoneModels.addPhone(newPhone).then(response => {
      helpers.response(res, [], 200, helpers.status.insert)
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  deletePhone: (req, res) => {
    const id = req.params.id
    const idUser = req.userId

    phoneModels.getPhoneById(id).then(response => {
      const detailPhone = response[0]
      if (detailPhone.userId !== idUser) {
        helpers.response(res, [], 400, 'You have no right', true)
      } else if (detailPhone.status === 1) {
        helpers.response(res, [], 400, 'Can\'t delete primary phone', true)
      } else {
        phoneModels.deletePhone(id).then(response => {
          helpers.response(res, [], 200, helpers.status.delete)
        }).catch(err => {
          helpers.response(res, [], err.statusCode, err, true)
        })
      }
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  }
}

module.exports = user