const uuid = require('uuid')
const path = require('path')
const {Op} = require('sequelize')

const ApiError = require('../error/apiError')
const { Device, DeviceImage, DeviceCharacteristic } = require('../models/models')

class DeviceController {
    async create(req, res, next){
        try{
            let {name, vendorCode, description, shortDescription, price, brandId, categoryId ,subcategoryId, quantity, characteristics} = req.body

            const device = await Device.create({name, vendorCode, description, shortDescription, price,categoryId, brandId, subcategoryId, quantity})

            const images = req.files

            if(images){
                for (let image in images){
                    let img = images[image]
                    let fileName =  uuid.v4() + '.jpg';

                    img.mv(path.resolve(__dirname, '..', 'static', fileName));
                    await DeviceImage.create({path: path.resolve(__dirname, '..', 'static', fileName), deviceId: device.id});
                }
            }

            if (characteristics){
                characteristics = JSON.parse(characteristics)
                characteristics.forEach(char => {
                    DeviceCharacteristic.create({title: char.title, value: char.value, deviceId: device.id})
                })
            }
            
            return res.json( device )            
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }

        
    }

    async createCharacteristics(req, res, next){
        try{
            const {deviceId, characteristics} = req.body

            await characteristics.forEach(characteristic => {
                DeviceCharacteristic.create({
                    title: characteristic.title,
                    value: characteristic.value,
                    deviceId
                })
            })

            res.json(characteristics);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next){
        try{
            let {subcategoryId, brandId, categoryId, limit, page} = req.query;

            page = page || 1;
            limit = limit || 9;
            let offset = page * limit - limit

            let devices;

            if(brandId && !categoryId && !subcategoryId){
                devices = await Device.findAndCountAll({where: {brandId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(brandId && categoryId && !subcategoryId){
                devices = await Device.findAndCountAll({where: {brandId, categoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(brandId && !categoryId && subcategoryId){
                devices = await Device.findAndCountAll({where: {brandId, subcategoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(brandId && categoryId && subcategoryId){
                devices = await Device.findAndCountAll({where: {brandId, categoryId, subcategoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }

            if(!brandId && !categoryId && !subcategoryId){
                devices = await Device.findAndCountAll({limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(!brandId && categoryId && !subcategoryId){
                devices = await Device.findAndCountAll({where: {categoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(!brandId && !categoryId && subcategoryId){
                devices = await Device.findAndCountAll({where: {subcategoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }
            else if(!brandId && categoryId && subcategoryId){
                devices = await Device.findAndCountAll({where: {categoryId, subcategoryId}, limit, offset, include: [{model: DeviceImage, as: 'images'}, {model: DeviceCharacteristic, as: 'characteristics'}]})
            }

            return res.json(devices)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const device = await Device.findOne({where: {id}, 
                                            include: [{model: DeviceCharacteristic, as: "characteristics"}, 
                                            {model: DeviceImage, as: "images"}]})
            return res.json(device)
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
    
    async editOne(req, res, next){
        try{
            const {id} = req.params;
            const changes = req.body;
            let characteristicsFlag = false;
            let oldImagesFlag = false;
            let reqCharacteristics;
            let oldImages;
            if(changes.characteristics) {
                reqCharacteristics = changes.characteristics || '';
                delete changes.characteristics;
                characteristicsFlag = true;
            };
            if(changes.oldImages){
                oldImages = JSON.parse(changes.oldImages) || [];
                delete changes.oldImages;
                oldImagesFlag = true;
            }
            const reqImages = req.files;

            
            const device = await Device.findOne({where: {id}, include: [{model: DeviceCharacteristic, as: 'characteristics'}, {model: DeviceImage, as: 'images'}]});


            await device.update(changes);
            
            if(oldImagesFlag){
                await DeviceImage.destroy({where: {deviceId: device.id,[Op.not]:{id: oldImages} }});
            };
            
            if(reqImages){
                for (let image in reqImages){
                    let img = reqImages[image]
                    let fileName =  uuid.v4() + '.jpg';

                    img.mv(path.resolve(__dirname, '..', 'static', fileName));
                    await DeviceImage.create({path: path.resolve(__dirname, '..', 'static', fileName), deviceId: device.id});
                }
            };

            if(characteristicsFlag){
                await DeviceCharacteristic.destroy({where: {deviceId: id}})
                await reqCharacteristics.forEach(charact => {
                    DeviceCharacteristic.create({title: charact.title, value: charact.value, deviceId: id})
                })
            };

            return res.json(changes, req.files);
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne(req, res, next){
        try{
            const {id} = req.params;
            const device = await Device.findOne({where: {id}, 
                include: [{model: DeviceCharacteristic, as: "characteristics"}, 
                {model: DeviceImage, as: "images"}]});
            
            await device.destroy();
            return res.json(device);
        }
        
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new DeviceController()

