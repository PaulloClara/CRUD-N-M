const User = require('../models/User')
const bcrypt = require('../services/bcrypt')
const jwt = require('../services/jsonwebtoken')

module.exports = {
  allUser: async (req, res) => {
    try{
      const users = await User.find()  //.select('+userName +password')
      return res.status(200).send(users)
    }catch(err){
      return res.status(400).send({ error: 'Error' })
    }
  },
  register: async (req, res) => {
    try{
      const json = req.body
      if (!json)
        return res.status(400).send({ error: 'JSON was not sent'})
      const userName = new RegExp(json.userName, 'i')
      if (await User.findOne({ userName }))
        return res.status(400).send({ error: 'User already registered' })
      json.password = await bcrypt.hash(json.password)
      if (!json.password)
        return res.status(403).send({ error: 'Error' })
      const user = await User.create(json)
      user.userName = undefined
      user.password = undefined
      const token = jwt.sign(user.id)
      return res.status(200).send({ user: user, token: token})
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  login: async (req, res) => {
    try{
      let { userName, password } = req.body
      userName = new RegExp(userName, 'i')
      const user = await User.findOne({ userName }).select('+password')
      if (!user)
        return res.status(400).send({ error: 'UserName Error' })
      if (!await bcrypt.compare(password, user.password))
        return res.status(401).send({ error: 'Password Error' })
      const token = jwt.sign(user.id)
      user.password = undefined
      return res.send({ user, token })
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  }
}
