const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('ola mundo')
})

module.exports = app => app.use(router)
