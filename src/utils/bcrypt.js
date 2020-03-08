const bcrypt = require("bcrypt");

module.exports = {
  hash: password => bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS),
  compare: (password, hash) => bcrypt.compare(password, hash)
};
