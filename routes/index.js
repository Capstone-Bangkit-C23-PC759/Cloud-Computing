const glob = require('glob')
const path = require('path')
const _ = require('lodash')

const routes = []
glob.sync('./routes/*.route.js').forEach((file) => {
    routes.push(require(path.resolve(file)))
  })
module.exports = _.flattenDeep(routes)
