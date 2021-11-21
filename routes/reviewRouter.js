const Router = require('express');
const router = new Router();
const ReviewController = require("../controllers/reviewController");
const authMiddleWare = require('../middleware/authMiddleware');

router.post('/', authMiddleWare, ReviewController.create);
router.get('/', ReviewController.getAll);
router.get('/:id', ReviewController.getOne);
router.delete('/:id', authMiddleWare, ReviewController.delete);

module.exports = router;