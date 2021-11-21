const {Category, Subcategory, Device} = require('../models/models')
const ApiError = require('../error/apiError')

class CategoryController {
    //Category methods

    async createCategory(req, res, next){
        try{
            const {name} = req.body
            const category = await Category.create({name})
            return res.json(category)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllCategory(req, res, next){
        try{
            const categories = await Category.findAll({include: [{model: Device, as: 'devices'}]});
            res.json(categories)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getTheCategory(req, res, next){
        try{
            const {id} = req.params
            const category = await Category.findOne({
                where:{
                id
                }
            })
            return res.json(category)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async renameCategory(req, res, next){
        try{
            const {id, newName} = req.body
            await Category.update({name: newName}, {where: {id}})
            return res.json({message: `Category by id = ${id} has been renamed to ${newName}`})
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async removeCategory(req, res, next){
        try{
            const {id} = req.params
            const category = await Category.destroy({where: {id}})
            return res.json(category)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    //Subcategoty methods

    async createSubcategory(req, res, next){
        try{
            const {name, categoryId} = req.body
            const category = await Subcategory.create({name, categoryId})
            return res.json(category)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllSubcategory(req, res, next){
        try{
            const subcategories = await Subcategory.findAll({include: [{model: Device, as: 'devices'}]})
            return res.json(subcategories)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getTheSubcategory(req, res, next){
        try{
            const {id} = req.params
            const subcategory = await Subcategory.findOne({
                where:{
                id
                },
                include: [{model: Device, as: 'devices'}]
            })
            return res.json(subcategory)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async renameSubcategory(req, res, next){
        try{
            const {id, newName} = req.body
            const subcat = await Subcategory.update({name: newName}, {where: {id}})
            return res.json(subcat)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async removeSubcategory(req, res, next){
        try{
            const {id} = req.params;
            const subcat = await Subcategory.destroy({where: {id}});

            return res.json(subcat);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CategoryController()