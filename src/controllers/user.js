const User = require('../models/user');
const bcrypt = require('../services/bcrypt');
const jwt = require('../services/jsonwebtoken');

async function register(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ erro: 'JSON not found.' });
    const username = new RegExp(json.username, 'i');
    if (await User.findOne({ username })) {
      return res.status(400).send({ erro: 'Username already exists.' });
    }
    const email = new RegExp(json.email, 'i');
    if (await User.findOne({ email })) {
      return res.status(400).send({ erro: 'Email is already in use.' });
    }
    json.password = await bcrypt.hash(json.password);
    if (!json.password) return res.status(403).send({ erro: 'Error.' });
    const user = await User.create(json);
    user.username = undefined;
    user.email = undefined;
    user.password = undefined;
    const token = jwt.sign(user.id);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function login(req, res) {
  try {
    const { username, email, password } = req.body;
    let user = {};
    if (username) user = await User.findOne({ username }).select('+password +email');
    else user = await User.findOne({ email }).select('+password +username');
    if (!user) return res.status(400).send({ erro: 'User not found.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ erro: 'incorrect password.' });
    const token = jwt.sign(user.id);
    user.password = undefined;
    return res.send({ user, token });
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function infos(req, res) {
  try {
    const { userId: _id } = req;
    const user = await User.findOne({ _id });
    // .select('+username +password +email')
    if (!user) return res.status(404).send({ erro: 'User not found.' });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function update(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ erro: 'JSON não foi encontrado.' });
    if (json.password) return res.status(401).send({ erro: 'Não autorizado.' });
    await User.updateOne({ _id: req.userId }, json);
    const user = await User.findOne({ _id: req.userId }).select('+username +email');
    if (!user) return res.status(404).send({ erro: 'User not found.' });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function updatePassword(req, res) {
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) return res.status(401).send({ erro: 'Senha não foi encontrada.' });
    const user = await User.findOne({ _id: req.userId }).select('+password +email');
    if (!user) return res.status(404).send({ erro: 'User not found.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ erro: 'Senha incorreta.' });
    const newHash = await bcrypt.hash(newPassword);
    await User.updateOne({ _id: req.userId }, { password: newHash }, { new: true });
    // .select('+username +password')
    return res.status(200).send({ status: 'OK.' });
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function deletee(req, res) {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.userId }).select('+password +email');
    if (!user) return res.status(404).send({ erro: 'User not found.' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ erro: 'Senha incorreta.' });
    await User.deleteOne({ _id: req.userId });
    return res.status(200).send({ status: 'OK.' });
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

async function allUsers(req, res) {
  try {
    const users = await User.find();
    // .select('+username +password +email')
    return res.status(200).send(users);
  } catch (err) {
    return res.status(400).send({ erro: 'Error.' });
  }
}

module.exports = {
  login,
  register,
  infos,
  deletee,
  update,
  updatePassword,
  allUsers,
};
