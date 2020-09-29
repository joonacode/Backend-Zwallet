const connection = require('../config/db.config')
const queryHelper = require('../helpers/query')

const user = {
  getAllUser: (id, order, limit, offset, search, orderBy) => {
    return queryHelper(
      `SELECT users.*, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.id != ${id} AND roleId = 2 AND status = 1 ${search ? `AND users.fullName LIKE '%${search}%'` : ''} ORDER BY ${orderBy} ${order} LIMIT ${limit} OFFSET ${offset}`,
    )
  },
  getTotal: (id) => {
    return queryHelper(`SELECT COUNT(*) AS total FROM users WHERE status = 1 AND roleId = 2 AND users.id != ${id}`)
  },
  getTotalSearch: (id, query) => {
    return queryHelper(`SELECT * FROM users WHERE status = 1 AND roleId = 2 AND users.id != ? AND  fullName LIKE ?`, [id, `%${query}%`])
  },
  getUserById: (id) => {
    return queryHelper(
      `SELECT users.*, role.name as roleName FROM users JOIN role on users.roleId = role.id  WHERE users.id = ${id}`,
    )
  },
  getUserByEmail: (email) => {
    return queryHelper(
      `SELECT * FROM users WHERE email = ?`, email,
    )
  },
  updateUser: (dataUser, id) => {
    return queryHelper('UPDATE users SET ? WHERE id = ?', [dataUser, id])
  },
  deleteUser: (id) => {
    return queryHelper('DELETE FROM users WHERE id = ?', id)
  },
  signup: (newUser) => {
    return queryHelper('INSERT INTO users SET ?', newUser)
  },
  login: (email) => {
    return queryHelper(
      'SELECT users.*, role.name as roleName FROM users JOIN role WHERE users.roleId = role.id AND users.email = ?',
      email,
    )
  },
  checkEmailExist: (email) => {
    return queryHelper(
      'SELECT COUNT(*) AS totalFound FROM users WHERE email = ?',
      email,
    )
  },
  checkUsernameExist: (username) => {
    return queryHelper(
      'SELECT COUNT(*) AS totalFound FROM users WHERE username = ?',
      username,
    )
  },
  sendToken: (token) => {
    return queryHelper('INSERT INTO token SET ?', token)
  },
  findToken: (token) => {
    return queryHelper('SELECT * FROM token WHERE token = ?', token)
  },
  activateAccount: (id) => {
    return queryHelper('UPDATE users SET status = 1 WHERE id = ?', id)
  },
  deleteToken: (token) => {
    return queryHelper('DELETE FROM token WHERE token = ?', token)
  }
}
module.exports = user