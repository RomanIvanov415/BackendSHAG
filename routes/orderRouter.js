const Router = require('express');
const router = new Router();
const OrderController = require("../controllers/orderController");
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, OrderController.create);
router.get('/getone/:id', checkRoleMiddleware('ADMIN'), OrderController.getOne);
router.get('/getAll', checkRoleMiddleware('ADMIN'), OrderController.getAll);
router.get('/getAll/:id', checkRoleMiddleware('ADMIN'), OrderController.getAllByUserId);
router.get('/data', checkRoleMiddleware('ADMIN'), OrderController.getData);
router.delete('/deleteone/:id', checkRoleMiddleware('ADMIN'), OrderController.deleteOne);
router.delete('/deletebyuserid/:id', checkRoleMiddleware('ADMIN'), OrderController.deleteByUserId);

module.exports = router