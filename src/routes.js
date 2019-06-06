const router = require('express').Router();

const authMiddleware = require('./middlewares/auth');

const others = require('./controllers/others');
const userController = require('./controllers/userController');

router.get('/', others.root);

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/user', authMiddleware, userController.data);

router.get('/all/user', userController.allUser);
router.put('/user/update', authMiddleware, userController.update);
router.delete('/user/delete', authMiddleware, userController.remove);
router.put('/user/update/password', authMiddleware, userController.updatePassword);

module.exports = app => app.use(router);
