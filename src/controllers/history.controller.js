const helpers = require('../helpers/helpers')
const historyModels = require('../models/history.model')
const userModels = require('../models/user.model')
let totalData
const history = {
  getAllHistory: (req, res) => {
    const order = req.query.order || null
    historyModels.getAllHistory(order).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getAllTopup: (req, res) => {
    const order = req.query.order || null
    historyModels.getAllTopup(order).then(response => {
      helpers.response(res, response, 200, helpers.status.found)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getMyHistory: (req, res) => {
    const id = req.userId
    const limit = Number(req.query.limit) || 10
    const page = !req.query.page ? 1 : req.query.page
    const offset = (Number(page) === 0 ? 1 : page - 1) * limit
    const order = req.query.order || null
    historyModels.getTotal(id).then(response => {
      totalData = response[0].total
    }).catch(err => console.log(err))
    historyModels.getMyHistory(id, order, limit, offset).then(response => {
      const newResponse = response
      const count = newResponse.length
      const total = totalData
      const links = helpers.links(limit, page, total, count)
      helpers.response(res, newResponse, 200, helpers.status.found, false, links)

    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getMyIncome: (req, res) => {
    const id = req.userId
    historyModels.getMyIncome(id).then(response => {
      const newRes = response[0].income
      historyModels.getMyIncomeTransfer(id).then(resTransfer => {
        let total
        const newResTransfer = resTransfer[0].incomeTransfer
        if (!newResTransfer) {
          total = Number(newRes)
        } else if (newResTransfer && newRes) {
          total = Number(newRes) + Number(newResTransfer)
        } else {
          total = Number(newResTransfer)
        }
        helpers.response(res, {
          income: total
        }, 200, helpers.status.found)
      })
    }).catch(err => {
      helpers.response(res, [], err.statusCode, err, true)
    })
  },
  getMyOutcome: (req, res) => {
    const id = req.userId
    historyModels.getMyOutcome(id).then(response => {
      let total
      const newResponse = response[0].outcome
      if (!newResponse) {
        total = 0
      } else {
        total = newResponse
      }
      helpers.response(res, {
        outcome: total
      }, 200, helpers.status.found)

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
    if (Number(status) !== 2 && Number(status) !== 1) return helpers.response(res, [], 400, 'Status invalid', true)

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
          if (Number(status) === 2) {
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