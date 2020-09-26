const helpers = require('../helpers/helpers')
const errorHandling = require('../helpers/errorHandling')
const phoneModels = require('../models/phone.model')
const historyModels = require('../models/history.model')
const userModels = require('../models/user.model')

const history = {
  getAllHistory: (req, res) => {
    historyModels.getAllHistory().then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getAllTopup: (req, res) => {
    historyModels.getAllTopup().then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getMyHistory: (req, res) => {
    const id = req.userId
    historyModels.getMyHistory(id).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  transfer: (req, res) => {
    const {
      receiverId,
      notes,
      amount,
      pin
    } = req.body
    const id = req.userId
    const newTransfer1 = {
      userId: id,
      senderId: id,
      receiverId,
      amount,
      notes,
      status: 1
    }
    const newTransfer2 = {
      userId: receiverId,
      senderId: id,
      receiverId,
      amount,
      notes,
      status: 1
    }
    historyModels.addHistory(newTransfer1).then(response => {
      userModels.getUserById(id).then(respon => {
        const balanceNow = respon[0].balance - Number(amount)
        userModels.updateUser({
          balance: balanceNow
        }, id).then(respon => console.log('ok'))
      })
      userModels.getUserById(receiverId).then(respon => {
        const balanceNow = respon[0].balance + Number(amount)
        userModels.updateUser({
          balance: balanceNow
        }, receiverId).then(respon => console.log('ok'))
        historyModels.getDetailHistory(response.insertId).then(resDetail => {
          helpers.response(res, resDetail[0], 200, helpers.status.insert)
        })
      })
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
    historyModels.addHistory(newTransfer2).then(response => console.log('ok')).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })

  },
  changeStatusTopUp: (req, res) => {
    const {
      status
    } = req.body
    const id = req.params.id
    if (!status) return helpers.response(res, [], 400, 'Status required', true)
    if (status !== '2' && status !== '1') return helpers.response(res, [], 400, 'Status invalid', true)

    historyModels.getDetailHistoryTopup(id).then(response => {
      const detail = response[0]
      if (detail.statusTopup === 1) {
        helpers.response(res, [], 200, 'Status topup sudah diterima')
      } else if (detail.statusTopup === 2) {
        helpers.response(res, [], 200, 'Status topup sudah ditolak')
      } else {
        historyModels.updateHistory({
          statusTopup: status
        }, id).then(response => {
          if (status === '2') {
            helpers.response(res, [], 200, 'Status changed successfully')
          } else {
            userModels.getUserById(detail.userId).then(respon => {
              const balanceNow = respon[0].balance + Number(detail.amount)
              userModels.updateUser({
                balance: balanceNow
              }, detail.userId).then(respon => {
                helpers.response(res, [], 200, 'Status changed successfully')
              }).catch(err => {
                helpers.response(res, [], err.statusCode, err, true)
              })

            }).catch(err => {
              helpers.response(res, [], err.statusCode, err, true)
            })
          }
        }).catch(err => {
          helpers.response(res, [], err.statusCode, err, true)
        })
      }
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  topup: (req, res) => {
    const {
      amount
    } = req.body
    const id = req.userId
    if (req.uploadErrorMessage)
      return helpers.response(res, [], 400, req.uploadErrorMessage, true)
    const newTransfer = {
      userId: id,
      senderId: id,
      receiverId: 1,
      amount,
      notes: 'Top Up Balance',
      status: 2,
      statusTopup: 0,
      image: `${process.env.BASE_URL}/${req.file.path}`
    }
    historyModels.addHistory(newTransfer).then(response => {
      helpers.response(res, response, 200, helpers.status.insert)
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  detailHistory: (req, res) => {
    const id = req.params.id
    historyModels.getDetailHistory(id).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  }
}

module.exports = history