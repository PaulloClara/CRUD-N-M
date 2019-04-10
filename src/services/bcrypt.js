const bcrypt = require('bcrypt')

module.exports = {
  hash: password => bcrypt.hash(password, 12).then(hash => hash),
  compare: (password, hash) => bcrypt.compare(password, hash).then(result => !result ? false : true)
}
