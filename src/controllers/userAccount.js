const User = require('../models/User')
const bcrypt = require('../services/bcrypt')

module.exports = {
  data: async (req, res) => {
    try{
      const user = await User.findOne({ _id: req.userId })  //.select('+userName +password')
      if (!user)
        return res.status(400).send({ error: 'User not found' })
      return res.status(200).send(user)
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  update: async (req, res) => {
    try{
      const json = req.body
      if (!json)
        return res.status(400).send({ error: 'JSON was not sent' })
      if (json.password)
        return res.status(401).send({ error: 'Unauthorized route to change password' })
      const user = await User.findOneAndUpdate({ _id: req.userId }, json, { new: true })  //.select('+userName +password')
      if (!user)
        return res.status(404).send({ error: 'User not found' })
      return res.status(200).send(user)
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  updatePassword: async (req, res) => {
    try{
      const { password, newPassword } = req.body
      if (!password || !newPassword)
        return res.status(401).send({ error: 'Password was not sent' })
      const user = await User.findOne({ _id: req.userId }).select('+password')
      if (!user)
        return res.status(404).send({ error: 'User not found' })
      if (!await bcrypt.compare(password, user.password))
        return res.status(401).send({ error: 'Incorrect password' })
      const newPasswordHash = await bcrypt.hash(newPassword)
      await User.findOneAndUpdate({ _id: req.userId }, { password: newPasswordHash }, { new: true })  //.select('+userName +password')
      return res.status(200).send({ status: 'OK' })
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  remove: async (req, res) => {
    try{
      const { password } = req.body
      const user = await User.findOne({ _id: req.userId }).select('+password')
      if (!user)
        return res.status(404).send({ error: 'User not found' })
      if (!await bcrypt.compare(password, user.password))
        return res.status(401).send({ error: 'Incorrect password' })
      await User.findOneAndDelete({ _id: req.userId })
      return res.status(200).send({ status: 'OK' })
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  }
}
