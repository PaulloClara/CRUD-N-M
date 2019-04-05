const mongoose = require('../config/mongoose')

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
