const jwt = require('../services/jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ erro: 'Token não encontrado' });
  const decoded = jwt.verify(token);
  if (!decoded) return res.status(401).send({ erro: 'Token Invalido' });
  req.userId = decoded.id;
  return next();
};
