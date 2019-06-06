const User = require('../models/User');
const bcrypt = require('../services/bcrypt');
const jwt = require('../services/jsonwebtoken');

async function register(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ error: 'JSON was not sent' });
    const userName = new RegExp(json.userName, 'i');
    if (await User.findOne({ userName })) return res.status(400).send({ error: 'User already registered' });
    json.password = await bcrypt.hash(json.password);
    if (!json.password) return res.status(403).send({ error: 'Error' });
    const user = await User.create(json);
    user.userName = undefined;
    user.password = undefined;
    const token = jwt.sign(user.id);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function login(req, res) {
  try {
    const { userName, password } = req.body;
    const userNameRE = new RegExp(userName, 'i');
    const user = await User.findOne({ userName: userNameRE }).select('+password');
    if (!user) return res.status(400).send({ error: 'UserName Error' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ error: 'Password Error' });
    const token = jwt.sign(user.id);
    user.password = undefined;
    return res.send({ user, token });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function data(req, res) {
  try {
    const { userId: _id } = req;
    const user = await User.findOne({ _id });
    // .select('+userName +password')
    if (!user) return res.status(404).send({ error: 'User not found' });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function update(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ error: 'JSON was not sent' });
    if (json.password) return res.status(401).send({ error: 'Unauthorized route to change password' });
    const user = await User.findOneAndUpdate({ _id: req.userId }, json, { new: true });
    // .select('+userName +password')
    if (!user) return res.status(404).send({ error: 'User not found' });
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function updatePassword(req, res) {
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) return res.status(401).send({ error: 'Password was not sent' });
    const user = await User.findOne({ _id: req.userId }).select('+password');
    if (!user) return res.status(404).send({ error: 'User not found' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ error: 'Incorrect password' });
    const newPasswordHash = await bcrypt.hash(newPassword);
    await User.findOneAndUpdate({ _id: req.userId }, { password: newPasswordHash }, { new: true });
    // .select('+userName +password')
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function remove(req, res) {
  try {
    const { password } = req.body;
    const user = await User.findOne({ _id: req.userId }).select('+password');
    if (!user) return res.status(404).send({ error: 'User not found' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).send({ error: 'Incorrect password' });
    await User.findOneAndDelete({ _id: req.userId });
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

async function allUser(req, res) {
  try {
    const users = await User.find();
    // .select('+userName +password')
    return res.status(200).send(users);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
}

module.exports = {
  data,
  login,
  update,
  remove,
  allUser,
  register,
  updatePassword,
};
