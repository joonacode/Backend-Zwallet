const redis = require('redis')
const client = redis.createClient(process.env.PORT_REDIS)
const helpers = require('../helpers/helpers')

module.exports = {
  cacheAllProducts: (req, res, next) => {
    client.get('getAllProducts', (err, data) => {
      if (err) throw err
      if (data) {
        helpers.response(res, JSON.parse(data), 200, helpers.status.found, null)
      } else {
        next()
      }
    })
  }
}