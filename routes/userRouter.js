const Router = require('express');
const router = new Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.get('/auth', authMiddleware, UserController.auth);
router.get('/',checkRoleMiddleware('ADMIN') ,UserController.getAll);
router.get('/getone/:id', checkRoleMiddleware('ADMIN'), UserController.getOne);
router.put('/:id',checkRoleMiddleware('ADMIN') , UserController.updateUser);
router.delete('/:id', checkRoleMiddleware('ADMIN'), UserController.deleteUser);

module.exports = router;