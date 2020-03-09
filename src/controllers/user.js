const User = require("../models/user");

const jwt = require("../utils/jwt");
const bcrypt = require("../utils/bcrypt");

module.exports = {
  async login(request, response) {
    try {
      const { username, email, password } = request.body;

      const user = await User.findOne(
        username ? { username } : { email }
      ).select("+password");

      if (!user) throw { msg: "User not found", code: 404 };

      if (!(await bcrypt.compare(password, user.password)))
        throw { msg: "Incorrect password", code: 401 };

      const token = jwt.sign(user.id);

      user.password = undefined;

      response.return({ user, token }, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async register(request, response) {
    try {
      const json = request.body;
      if (!json) throw { msg: "JSON not found", code: 404 };

      if (await User.findOne({ username: json.username }))
        throw { msg: "Username already exists", code: 400 };

      if (await User.findOne({ email: json.email }))
        throw { msg: "Email is already in use", code: 400 };

      json.password = await bcrypt.hash(json.password);
      if (!json.password) throw "Internal error";

      const user = await User.create(json);

      user.email = undefined;
      user.username = undefined;
      user.password = undefined;

      const token = jwt.sign(user.id);

      response.return({ user, token }, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async show(request, response) {
    try {
      const { userID: _id } = request;

      const user = await User.findOne({ _id });
      if (!user) throw { msg: "User not found", code: 404 };

      response.return(user, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async index(request, response) {
    try {
      const users = await User.find();

      response.return(users, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async update(request, response) {
    try {
      const json = request.body;
      const { userID: _id } = request;

      if (!json) throw { msg: "JSON not found", code: 404 };

      if (json.password || json._id || json.id)
        throw { msg: "Unauthorized", code: 401 };

      await User.updateOne({ _id }, json);

      const user = await User.findOne({ _id });
      if (!user) throw { msg: "User not found", code: 404 };

      response.return(user, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async updatePassword(request, response) {
    try {
      const { userID: _id } = request;
      const { password, newPassword } = request.body;

      if (!password || !newPassword)
        throw { msg: "Password not found", code: 401 };

      const user = await User.findOne({ _id }).select("+password");
      if (!user) throw { msg: "User not found", code: 404 };

      if (!(await bcrypt.compare(password, user.password)))
        throw { msg: "Incorrect password", code: 401 };

      const newHash = await bcrypt.hash(newPassword);

      await User.updateOne({ _id }, { password: newHash }, { new: true });

      response.return({ status: "OK" }, 200);
    } catch (error) {
      response.returnError(error);
    }
  },
  async destroy(request, response) {
    try {
      const { userID: _id } = request;
      const { password } = request.body;

      const user = await User.findOne({ _id }).select("+password");
      if (!user) throw { msg: "User not found", code: 404 };

      if (!(await bcrypt.compare(password, user.password)))
        throw { msg: "Incorrect password", code: 401 };

      await User.deleteOne({ _id });

      response.return({ status: "OK" }, 200);
    } catch (error) {
      response.returnError(error);
    }
  }
};
