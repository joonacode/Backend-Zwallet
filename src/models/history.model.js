const connection = require('../config/db.config')
const queryHelper = require('../helpers/query')

const history = {
  getAllHistory: (order) => {
    return queryHelper(`SELECT 
    history.*,
    receiver.fullName as receiverName,
    receiver.phoneNumber as receiverPhone,
    receiver.image as receiverImage,
    sender.fullName as senderName,
    sender.phoneNumber as senderPhone,
    sender.image as senderImage
    FROM history 
    INNER JOIN users as receiver
      on history.receiverId = receiver.id
    INNER JOIN users as sender
      on history.senderId = sender.id ORDER BY history.id ${order ? order : 'desc'}`)
  },
  getAllTopup: (order) => {
    return queryHelper(`SELECT 
    history.*,
    receiver.fullName as receiverName,
    receiver.phoneNumber as receiverPhone,
    receiver.image as receiverImage,
    sender.fullName as senderName,
    sender.phoneNumber as senderPhone,
    sender.image as senderImage
    FROM history 
    INNER JOIN users as receiver
      on history.receiverId = receiver.id
    INNER JOIN users as sender
      on history.senderId = sender.id WHERE history.status = 2 ORDER BY history.id ${order ? order : 'desc'}`)
  },
  getDetailHistory: (id) => {
    return queryHelper(
      `SELECT 
        history.*,
        receiver.fullName as receiverName,
        receiver.phoneNumber as receiverPhone,
        receiver.image as receiverImage,
        sender.fullName as senderName,
        sender.phoneNumber as senderPhone,
        sender.image as senderImage
        FROM history 
        INNER JOIN users as receiver
          on history.receiverId = receiver.id
        INNER JOIN users as sender
          on history.senderId = sender.id WHERE history.id = ${id}`,
    )
  },
  getDetailHistoryTopup: (id) => {
    return queryHelper(
      `SELECT 
        history.*,
        receiver.fullName as receiverName,
        receiver.phoneNumber as receiverPhone,
        receiver.image as receiverImage,
        sender.fullName as senderName,
        sender.phoneNumber as senderPhone,
        sender.image as senderImage
        FROM history 
        INNER JOIN users as receiver
          on history.receiverId = receiver.id
        INNER JOIN users as sender
          on history.senderId = sender.id WHERE history.id = ${id} AND history.status = 2`,
    )
  },
  getMyHistory: (id) => {
    return queryHelper(
      `SELECT 
        history.*,
        receiver.fullName as receiverName,
        receiver.phoneNumber as receiverPhone,
        receiver.image as receiverImage,
        sender.fullName as senderName,
        sender.phoneNumber as senderPhone,
        sender.image as senderImage
        FROM history 
        INNER JOIN users as receiver
          on history.receiverId = receiver.id
        INNER JOIN users as sender
          on history.senderId = sender.id WHERE history.userId = ${id}`,
    )
  },
  updateHistory: (dataHistory, id) => {
    return queryHelper('UPDATE history SET ? WHERE id = ?', [dataHistory, id])
  },
  deletePhone: (id) => {
    return queryHelper('DELETE FROM phoneNumber WHERE id = ?', id)
  },
  deletePhoneByUser: (id) => {
    return queryHelper('DELETE FROM phoneNumber WHERE userId = ?', id)
  },
  addHistory: (history) => {
    return queryHelper('INSERT INTO history SET ?', history)
  }
}
module.exports = history