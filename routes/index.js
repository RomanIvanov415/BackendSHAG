const Router = require('express');
const router = new Router();

const deviceRouter = require('./deviceRouter');
const brandRouter = require('./brandRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const reviewRouter = require('./reviewRouter');
const orderRouter = require('./orderRouter');


router.use('/brand', brandRouter);
router.use('/category', categoryRouter);
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/review', reviewRouter);
router.use('/order', orderRouter);


module.exports = router;