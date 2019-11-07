const User = require("../models/user");

const bcrypt = require("../services/bcrypt");
const jwt = require("../services/jsonwebtoken");

module.exports = {
  async login(req, res) {
    const { username, email, password } = req.body;

    try {
      const search = username ? { username } : { email };
      const user = await User.findOne(search).select("+password +username");
      if (!user) return res.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return res.status(401).send({ error: "incorrect password" });

      const token = jwt.sign(user.id);

      user.password = undefined;

      return res.status(200).send({ user, token });
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async register(req, res) {
    const json = req.body;

    try {
      if (!json) return res.status(404).send({ error: "json not found" });

      if (await User.findOne({ username: json.username }))
        return res.status(400).send({ error: "username already exists" });

      if (await User.findOne({ email: json.email }))
        return res.status(400).send({ error: "email is already in use" });

      json.password = await bcrypt.hash(json.password);
      if (!json.password)
        return res.status(403).send({ error: "unexpected error" });

      const user = await User.create(json);

      user.username = undefined;
      user.email = undefined;
      user.password = undefined;

      const token = jwt.sign(user.id);

      return res.status(200).send({ user, token });
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async getUser(req, res) {
    const { userId: _id } = req;

    try {
      const user = await User.findOne({ _id });
      if (!user) return res.status(404).send({ error: "user not found" });

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find();

      return res.status(200).send(users);
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async update(req, res) {
    const json = req.body;
    const { userId: _id } = req;

    try {
      if (!json) return res.status(404).send({ error: "json not found" });

      if (json.password || json._id || json.id)
        return res.status(401).send({ error: "not authorized" });

      await User.updateOne({ _id }, json);

      const user = await User.findOne({ _id }).select("+username +email");
      if (!user) return res.status(404).send({ error: "user not found" });

      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async updatePassword(req, res) {
    const { userId: _id } = req;
    const { password, newPassword } = req.body;

    try {
      if (!password || !newPassword)
        return res.status(401).send({ error: "password not found" });

      const user = await User.findOne({ _id }).select("+password +email");
      if (!user) return res.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return res.status(401).send({ error: "incorrect password" });

      const newHash = await bcrypt.hash(newPassword);

      await User.updateOne({ _id }, { password: newHash }, { new: true });

      return res.status(200).send({ status: "ok" });
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  },
  async delete(req, res) {
    const { userId: _id } = req;
    const { password } = req.body;

    try {
      const user = await User.findOne({ _id }).select("+password +email");
      if (!user) return res.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return res.status(401).send({ error: "incorrect password" });

      await User.deleteOne({ _id });

      return res.status(200).send({ status: "ok" });
    } catch (err) {
      return res.status(500).send({ error: "unexpected error" });
    }
  }
};
