const Usuario = require('../models/Usuario');
const bcrypt = require('../services/bcrypt');
const jwt = require('../services/jsonwebtoken');

async function register(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ erro: 'JSON não foi encontrado.' });
    const username = new RegExp(json.username, 'i');
    if (await Usuario.findOne({ username })) {
      return res.status(400).send({ erro: 'Username já existe.' });
    }
    const email = new RegExp(json.email, 'i');
    if (await Usuario.findOne({ email })) {
      return res.status(400).send({ erro: 'Email já esta em uso.' });
    }
    json.senha = await bcrypt.hash(json.senha);
    if (!json.senha) return res.status(403).send({ erro: 'Erro.' });
    const usuario = await Usuario.create(json);
    usuario.username = undefined;
    usuario.email = undefined;
    usuario.senha = undefined;
    const token = jwt.sign(usuario.id);
    return res.status(200).send({ usuario, token });
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function login(req, res) {
  try {
    const { username, email, senha } = req.body;
    let usuario = {};
    if (username) usuario = await Usuario.findOne({ username }).select('+senha +email');
    else usuario = await Usuario.findOne({ email }).select('+senha +username');
    if (!usuario) return res.status(400).send({ erro: 'Usuario não foi encontrado.' });
    if (!await bcrypt.compare(senha, usuario.senha)) return res.status(401).send({ erro: 'Senha incorreta.' });
    const token = jwt.sign(usuario.id);
    usuario.senha = undefined;
    return res.send({ usuario, token });
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function infos(req, res) {
  try {
    const { userId: _id } = req;
    const usuario = await Usuario.findOne({ _id });
    // .select('+username +senha +email')
    if (!usuario) return res.status(404).send({ erro: 'Usuario não foi encontrado.' });
    return res.status(200).send(usuario);
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function atualizar(req, res) {
  try {
    const json = req.body;
    if (!json) return res.status(400).send({ erro: 'JSON não foi encontrado.' });
    if (json.senha) return res.status(401).send({ erro: 'Não autorizado.' });
    await Usuario.updateOne({ _id: req.userId }, json);
    const usuario = await Usuario.findOne({ _id: req.userId }).select('+username +email');
    if (!usuario) return res.status(404).send({ erro: 'Usuario não foi encontrado.' });
    return res.status(200).send(usuario);
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function atualizarSenha(req, res) {
  try {
    const { senha, novaSenha } = req.body;
    if (!senha || !novaSenha) return res.status(401).send({ erro: 'Senha não foi encontrada.' });
    const usuario = await Usuario.findOne({ _id: req.userId }).select('+senha +email');
    if (!usuario) return res.status(404).send({ erro: 'Usuario não foi encontrado.' });
    if (!await bcrypt.compare(senha, usuario.senha)) return res.status(401).send({ erro: 'Senha incorreta.' });
    const novoHash = await bcrypt.hash(novaSenha);
    await Usuario.updateOne({ _id: req.userId }, { senha: novoHash }, { new: true });
    // .select('+username +senha')
    return res.status(200).send({ status: 'OK.' });
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function deletar(req, res) {
  try {
    const { senha } = req.body;
    const usuario = await Usuario.findOne({ _id: req.userId }).select('+senha +email');
    if (!usuario) return res.status(404).send({ erro: 'Usuario não foi encontrado.' });
    if (!await bcrypt.compare(senha, usuario.senha)) return res.status(401).send({ erro: 'Senha incorreta.' });
    await Usuario.deleteOne({ _id: req.userId });
    return res.status(200).send({ status: 'OK.' });
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

async function todosOsUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find();
    // .select('+username +senha +email')
    return res.status(200).send(usuarios);
  } catch (err) {
    return res.status(400).send({ erro: 'Erro.' });
  }
}

module.exports = {
  login,
  register,
  infos,
  deletar,
  atualizar,
  atualizarSenha,
  todosOsUsuarios,
};
