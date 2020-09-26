const connection = require('../config/db.config')
const queryHelper = require('../helpers/query')

const phone = {
  getAllPhone: (order) => {
    return queryHelper(
      `SELECT phoneNumber.*, users.firstName, users.lastName, users.username FROM phoneNumber JOIN users WHERE phoneNumber.userId = users.id ORDER BY id ${order ? order : 'desc'}`,
    )
  },
  getMyPhone: (id, order) => {
    return queryHelper(
      `SELECT phoneNumber.*, users.firstName, users.lastName, users.username FROM phoneNumber JOIN users WHERE phoneNumber.userId = users.id AND phoneNumber.userId = ${id} ORDER BY id ${order ? order : 'desc'}`,
    )
  },
  getMyPrimaryPhone: (id) => {
    return queryHelper(
      `SELECT phoneNumber.*, users.firstName, users.lastName, users.username FROM phoneNumber JOIN users WHERE phoneNumber.userId = users.id AND phoneNumber.userId = ${id} AND phoneNumber.status = 1`,
    )
  },
  getPhoneById: (id) => {
    return queryHelper(
      `SELECT phoneNumber.*, users.firstName, users.lastName, users.username FROM phoneNumber JOIN users WHERE phoneNumber.userId = users.id AND phoneNumber.id = ${id}`,
    )
  },
  updatePhone: (dataPhone, id) => {
    return queryHelper('UPDATE phoneNumber SET ? WHERE id = ?', [dataPhone, id])
  },
  deletePhone: (id) => {
    return queryHelper('DELETE FROM phoneNumber WHERE id = ?', id)
  },
  deletePhoneByUser: (id) => {
    return queryHelper('DELETE FROM phoneNumber WHERE userId = ?', id)
  },
  addPhone: (phone) => {
    return queryHelper('INSERT INTO phoneNumber SET ?', phone)
  }
}
module.exports = phone