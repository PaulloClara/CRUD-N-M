const router = require('express').Router();

const authMiddleware = require('./middlewares/auth');

const other = require('./controllers/other');
const user = require('./controllers/user');

router.get('/', other.home);

router.post('/login', user.login);
router.post('/register', user.register);

router.get('/user', authMiddleware, user.infos);
router.get('/users', user.allUsers);
router.put('/update/user', authMiddleware, user.update);
router.put('/update/password/user', authMiddleware, user.updatePassword);
router.delete('/delete/user', authMiddleware, user.deletee);

module.exports = app => app.use(router);
