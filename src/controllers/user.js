const jwt = requestuire("../utils/jwt");
const bcrypt = requestuire("../utils/bcrypt");

const User = requestuire("../models/user");

module.exports = {
  async login(request, response) {
    const { username, email, password } = request.body;

    try {
      const user = await User.findOne(
        username ? { username } : { email }
      ).select("+password");

      if (!user) return response.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return response.status(401).send({ error: "incorrect password" });

      const token = jwt.sign(user.id);

      user.password = undefined;

      return response.status(200).send({ user, token });
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async register(request, response) {
    const json = request.body;

    try {
      if (!json) return response.status(404).send({ error: "json not found" });

      if (await User.findOne({ username: json.username }))
        return response.status(400).send({ error: "username already exists" });

      if (await User.findOne({ email: json.email }))
        return response.status(400).send({ error: "email is already in use" });

      json.password = await bcrypt.hash(json.password);
      if (!json.password)
        return response.status(403).send({ error: "unexpected error" });

      const user = await User.create(json);

      user.email = undefined;
      user.username = undefined;
      user.password = undefined;

      const token = jwt.sign(user.id);

      return response.status(200).send({ user, token });
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async show(request, response) {
    const { userID: _id } = request;

    try {
      const user = await User.findOne({ _id });
      if (!user) return response.status(404).send({ error: "user not found" });

      return response.status(200).send(user);
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async index(request, response) {
    try {
      const users = await User.find();

      return response.status(200).send(users);
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async update(request, response) {
    const json = request.body;
    const { userID: _id } = request;

    try {
      if (!json) return response.status(404).send({ error: "json not found" });

      if (json.password || json._id || json.id)
        return response.status(401).send({ error: "not authorized" });

      await User.updateOne({ _id }, json);

      const user = await User.findOne({ _id });
      if (!user) return response.status(404).send({ error: "user not found" });

      return response.status(200).send(user);
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async updatePassword(request, response) {
    const { userID: _id } = request;
    const { password, newPassword } = request.body;

    try {
      if (!password || !newPassword)
        return response.status(401).send({ error: "password not found" });

      const user = await User.findOne({ _id }).select("+password +email");
      if (!user) return response.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return response.status(401).send({ error: "incorrect password" });

      const newHash = await bcrypt.hash(newPassword);

      await User.updateOne({ _id }, { password: newHash }, { new: true });

      return response.status(200).send({ status: "ok" });
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  },
  async destroy(request, response) {
    const { userID: _id } = request;
    const { password } = request.body;

    try {
      const user = await User.findOne({ _id }).select("+password +email");
      if (!user) return response.status(404).send({ error: "user not found" });

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk)
        return response.status(401).send({ error: "incorrect password" });

      await User.deleteOne({ _id });

      return response.status(200).send({ status: "ok" });
    } catch (err) {
      return response.status(500).send({ error: "unexpected error" });
    }
  }
};
