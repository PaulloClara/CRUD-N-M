const router = require('express').Router()
const authMiddleware = require('./middlewares/auth')

const userAccount = require('./controllers/userAccount')
const usersControl = require('./controllers/usersControl')
const others = require('./controllers/others')

router.get('/', authMiddleware, others.root)

router.get('/all/user', usersControl.allUser)
router.post('/login', usersControl.login)
router.post('/register', usersControl.register)

router.get('/user/', authMiddleware, userAccount.data)
router.put('/user/update', authMiddleware, userAccount.update)
router.put('/user/update/password', authMiddleware, userAccount.updatePassword)
router.delete('/user/delete', authMiddleware, userAccount.remove)

module.exports = app => app.use(router)
