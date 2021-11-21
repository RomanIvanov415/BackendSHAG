const ApiError = require("../error/apiError");
const { Order, OrderDevice, User, Device, DeviceImage } = require("../models/models");

class OrderController{
    async create (req, res, next) {
        try{
            const {devices, totalPrice} = req.body;     //devices == [{deviceId: int, quantity: int},{deviceId: int, quantity: int}]
            const userId = req.user.id;
            const order = await Order.create({userId, totalPrice});
            
            await devices.forEach(device => {
                OrderDevice.create({deviceId: device.deviceId, quantity: device.quantity, orderId: order.id});
            });

            return res.json({
                order
            });
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const order = await Order.findOne({where: {id}, include: [{model: OrderDevice, as: 'order_devices'}]});
            const orderDevices = [];
            if(order){

            const devices = await Device.findAll({include: [{model: DeviceImage, as: 'images'}]});
            order.order_devices.forEach(ordDev => {
                const device = devices.find(dev => dev.id === ordDev.deviceId);
                orderDevices.push({
                    id: device.id,
                    name: device.name,
                    vendorCode: device.vendorCode,
                    quantity: ordDev.quantity,
                    image: device.images[0].path.slice(-40)
                });
            });
                return res.json({order, orderDevices});
            }
            return res.json({find: false})
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllByUserId(req, res, next){
        try{
            const userId = req.params.id;
            const orders = await Order.findAll({where: {userId}, include: [{model: OrderDevice, as: 'order_devices'}]});

            return res.json(orders);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getData(req, res, next){
        try{
            const data = [];

            const clients = await User.findAll({where: {role: 'CLIENT'}, include: [{model: Order, as: 'orders'}]});

            clients.forEach(client => {
                client.orders.forEach(order => {
                    data.push({
                        id: order.id,
                        customerName: client.name,
                        sum: order.totalPrice,
                        date: (new Date(order.createdAt)).toDateString(),
                        completed: order.completed ? 'done' : 'not done'
                    })
                })
            })

            return res.json(data);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next){
        try{
            const orders = await Order.findAll({include: [{model: OrderDevice, as: 'order_devices'}]});

            return res.json(orders);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next){
        try{
            const {id} = req.params;
            const order = await Order.destroy({where: {id}});
            const orderDevices = await OrderDevice.destroy({where: {orderId: id}});
            return res.json({order, orderDevices});
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteByUserId(req, res, next){
        try{
            const userId = req.params.id;
            const orders = await Order.destroy({where: {userId}});

            res.json(orders);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
};

module.exports = new OrderController();