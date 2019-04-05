const mogoose = require('../config/mongoose')

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
