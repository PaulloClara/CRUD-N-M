const router = require('express').Router()

const userController = require('./controllers/user')
const othersController = require('./controllers/others')

router.get('/', othersController.root)
router.get('/all/user', userController.all)

router.get('/user/:username', userController.data)
router.post('/user', userController.create)
router.put('/user/:username', userController.update)
router.delete('/user/:username', userController.remove)

module.exports = app => app.use(router)
