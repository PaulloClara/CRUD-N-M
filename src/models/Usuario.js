const mongoose = require('../config/mongoose');

const UserSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  senha: {
    type: String,
    required: true,
    select: false,
  },
});

const Usuario = mongoose.model('Usuario', UserSchema);

module.exports = Usuario;
