const User = require('../models/User')

module.exports = {
  data: async (req, res) => {
    const userName = new RegExp(req.params.username, 'i')
    try{
      const user = await User.findOne({ userName })
      if (!user) return res.status(404).send({ error: 'User not found' })
      else return res.send(user)
    }catch(err){
      return res.status(400).send({ error: 'Error' })
    }
  },
  all: async (req, res) => {
    try{
      const users = await User.find()  //.select('+userName +password')
      return res.send(users)
    }catch(err){
      return res.status(400).send({ error: 'Error' })
    }
  },
  create: async (req, res) => {
    const json = req.body
    const userName = new RegExp(json.userName, 'i')
    try{
      if (await User.findOne({ userName })) return res.status(400).send({ error: 'User already registered' })
      const user = await User.create(json)
      user.userName = 'MyUserName'
      user.password = '********'
      return res.send(user)
    }catch(e) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  update: async (req, res) => {
    const json = req.body
    const userName = new RegExp(req.params.username, 'i')
    try{
      if (!await User.findOne({ userName })) return res.status(400).send({ error: 'User not found' })
      const user = await User.findOneAndUpdate({ userName }, json, { new: true })  //.select('+userName +password')
      return res.send(user)
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  },
  remove: async (req, res) => {
    const userName = new RegExp(req.params.username, 'i')
    try{
      if (!await User.findOne({ userName })) return res.status(400).send({ error: 'User not found' })
      await User.findOneAndRemove({ userName })
      return res.send({ status: 'OK' })
    }catch(err) {
      return res.status(400).send({ error: 'Error' })
    }
  }
}
