const jwt = require('jsonwebtoken');

module.exports = {
  sign: id => jwt.sign(
    { id },
    process.env.PRIVATE_KEY,
    { expiresIn: 86400 },
  ),
  verify: token => jwt.verify(
    token.split(' ')[1],
    process.env.PRIVATE_KEY,
    (err, decoded) => (err ? false : decoded),
  ),
};
