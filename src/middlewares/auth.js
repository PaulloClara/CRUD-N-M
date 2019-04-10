const jwt = require('../services/jsonwebtoken')

module.exports = (req, res, next) => {
  const { token } = req.headers
  if (!token)
    return res.status(401).send({ error: 'Token not found' })
  const decoded = jwt.verify(token)
  if (!decoded)
    return res.status(401).send({ error: 'Token Invalid' })
  req.userId = decoded.id
  return next()
}
