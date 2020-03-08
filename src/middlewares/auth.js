const jwt = require("../utils/jwt");

module.exports = (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) return res.status(401).send({ error: "token not found" });

  const token = auth.split(" ")[1];
  if (!token) return res.status(401).send({ error: "malformed token" });

  const decoded = jwt.verify(token);
  if (!decoded) return res.status(401).send({ error: "invalid token" });

  req.userID = decoded.id;

  return next();
};
