const Router = require('express');
const router = new Router();
const BasketController = require("../controllers/basketController");
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', BasketController.create);
router.post('/', authMiddleware, BasketController.addDevice);
router.get('/', authMiddleware, BasketController.getAll);
router.delete('/', authMiddleware, BasketController.removeAll);
router.delete('/:id', authMiddleware, BasketController.removeDevice);


module.exports = router;