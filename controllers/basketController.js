const ApiError = require("../error/apiError");
const { Basket, BasketDevice } = require("../models/models");

class BasketController{
    async create(req, res, next){
        try{
            const {userId} = req.body
            const basket = await Basket.create({userId})

            res.json(basket)
        }
        catch(e){
            next(ApiError.badRequest(e.mesasge));
        }
    }

    async addDevice(req, res, next){
        try{
            const existingBasketDevice = await BasketDevice.findOne({where: {deviceId: req.body.devideid}});
            if(existingBasketDevice){
                return res.status(405).json({message: 'Такой товар уже есть в корзине'})
            };

            const {deviceId, quantity} = req.body;
            const basket = await Basket.findOne({where: {userId: req.user.id}});
            const basketId = basket.id;
            const basketDevice = await BasketDevice.create({quantity, basketId, deviceId});

            return res.json(basketDevice);
        }
        catch(e){
            next(ApiError.badRequest(e.mesasge));
        }
        
    }

    async getAll(req, res, next){
        try{
            const basket = await Basket.findOne({where: {userId: req.user.id}, include: [{model: BasketDevice, as: 'basket_devices'}]});
            const basketDevices = basket.basket_devices;

            return res.json(basketDevices);
        }
        catch(e){
            next(ApiError.badRequest(e.mesasge));
        }
    }

    async removeDevice(req, res, next){
        try{
            const {id} = req.params;
            const basketDevice = await BasketDevice.destroy({where: {id}});

            return res.json(basketDevice);
        }
        catch(e){
            next(ApiError.badRequest(e.mesasge));
        }
    }

    async removeAll(req, res, next){
        try{
            const basket = await Basket.findOne({where: {userId: req.user.id}});
            const basketId = basket.id;
            const basketDevices = await BasketDevice.destroy({where: {basketId}});

            return res.json(basketDevices);
        }
        catch(e){
            next(ApiError.badRequest(e.mesasge));
        }
    }
};

module.exports = new BasketController();