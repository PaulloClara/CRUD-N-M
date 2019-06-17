const router = require('express').Router();

const authMiddleware = require('./middlewares/autenticacao');

const outras = require('./controllers/outras');
const usuario = require('./controllers/usuario');

router.get('/', outras.home);

router.post('/login', usuario.login);
router.post('/register', usuario.register);

router.get('/usuario', authMiddleware, usuario.infos);
router.get('/usuarios', usuario.todosOsUsuarios);
router.put('/atualizar/usuario', authMiddleware, usuario.atualizar);
router.put('/atualizar/senha/usuario', authMiddleware, usuario.atualizarSenha);
router.delete('/deletar/usuario', authMiddleware, usuario.deletar);

module.exports = app => app.use(router);
