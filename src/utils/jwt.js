const jwt = require("jsonwebtoken");

module.exports = {
  sign: id =>
    jwt.sign({ id }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: process.env.JWT_VALIDITY
    }),
  verify: token =>
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, result) =>
      error ? null : result
    )
};
