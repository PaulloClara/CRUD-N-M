const mongoose = require('../configs/mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
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
  password: {
    type: String,
    required: true,
    select: false,
  },
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;
