const jwt = require("../utils/jwt");

module.exports = (request, response, next) => {
  try {
    const auth = request.header("Authorization");
    if (!auth) throw { msg: "Token not found", code: 401 };

    const token = auth.split(" ")[1];
    if (!token) throw { msg: "Malformed token", code: 401 };

    const decoded = jwt.verify(token);
    if (!decoded) throw { msg: "Invalid token", code: 401 };

    request.userID = decoded.id;

    next();
  } catch (error) {
    response.returnError(error);
  }
};
