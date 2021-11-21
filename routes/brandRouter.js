const Router = require('express');
const router = new Router();
const BrandController = require('../controllers/brandController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', checkRoleMiddleware('ADMIN'), BrandController.create);
router.get('/', BrandController.getAll);
router.get('/:id', BrandController.getOne);
router.put('/', checkRoleMiddleware('ADMIN'), BrandController.rename);
router.delete('/:id', checkRoleMiddleware('ADMIN'), BrandController.remove);

module.exports = router;