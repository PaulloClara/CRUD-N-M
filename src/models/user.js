const mongoose = require("../database");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    select: false,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
