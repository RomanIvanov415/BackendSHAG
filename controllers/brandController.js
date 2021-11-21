const {Brand, Device} = require('../models/models');
const ApiError = require('../error/apiError')

class BrandController {
    async create(req, res, next){
        try{
            const {name} = req.body;
            const brand = await Brand.create({name});
            return res.json(brand);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res, next){
        try{
            const brands = await Brand.findAll({include: [{model: Device, as: 'devices'}]});
            return res.json(brands);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const brand = await Brand.findOne({where: {id}, include: [{model: Device, as: 'devices'}]});
            return res.json(brand);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    async rename(req, res, next){
        try{
            const {id, newName} = req.body;
            const brand = await Brand.update({name: newName}, {where: {id}})
            return res.json(brand);;
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    async remove(req, res, next){
        try{
            const {id} = req.params;
            const brand = await Brand.destroy({where: {id}});
            return res.json(brand);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    
}

module.exports = new BrandController()