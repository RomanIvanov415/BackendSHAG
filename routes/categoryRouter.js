const Router = require('express');
const router = new Router();
const CategoryController = require('../controllers/categoryController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

//Category
router.post('/', checkRoleMiddleware('ADMIN'), CategoryController.createCategory);
router.get('/getone/:id', CategoryController.getTheCategory);
router.get('/', CategoryController.getAllCategory);
router.put('/', checkRoleMiddleware('ADMIN'), CategoryController.renameCategory);
router.delete('/:id', checkRoleMiddleware('ADMIN'), CategoryController.removeCategory);

//Subcategory
router.get('/subcategory', CategoryController.getAllSubcategory);
router.get('/subcategory/:id', CategoryController.getTheSubcategory);
router.post('/subcategory', checkRoleMiddleware('ADMIN'), CategoryController.createSubcategory);
router.delete('/subcategory/:id', checkRoleMiddleware('ADMIN'), CategoryController.removeSubcategory);
router.put('/subcategory', checkRoleMiddleware('ADMIN'), CategoryController.renameSubcategory)

module.exports = router