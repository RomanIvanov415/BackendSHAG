const Router = require('express');
const router = new Router();
const DeviceController = require('../controllers/deviceController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

//Device

router.post('/', checkRoleMiddleware('ADMIN'), DeviceController.create);
router.get('/', DeviceController.getAll);
router.get('/getone/:id', DeviceController.getOne);
router.put('/:id', checkRoleMiddleware('ADMIN'), DeviceController.editOne);
router.delete('/:id', checkRoleMiddleware('ADMIN'), DeviceController.deleteOne);

//Device characteristics

router.post('/characteristic', checkRoleMiddleware('ADMIN'), DeviceController.createCharacteristics);

module.exports = router;