const ApiError = require("../error/apiError");
const { Review, ReviewImage, Device } = require("../models/models");

const uuid = require('uuid')
const path = require('path')

class ReviewController{
    async create(req, res, next){
        try{
            const existingReview = await Review.findOne({where: {userId: req.user.id, deviceId: req.body.deviceId}}); 
            if(existingReview){
                return res.status(405).json({message: 'Пользователь уже оставил отзыв об этом товаре'});
            }
            const {title, value, rating, deviceId} = req.body;
            const userId = req.user.id;
            const images = req.files;
            const review = await Review.create({title, value, rating, deviceId, userId});

            const device = await Device.findOne({where: {id: deviceId}, include: [{model: Review, as: 'reviews'}]});
            let totalScore = 0;
            device.reviews.forEach(rev => {
                totalScore += +rev.rating;
            });
            const newDeviceOverallRating = (totalScore / device.reviews.length);
            await device.update({overallRating: newDeviceOverallRating});

            if(images){
                for (let image in images) {
                    const img = images[image];
                    if(img.length){
                        img.forEach(async i => {
                            const fileName = uuid.v4() + '.jpg';
                            i.mv(path.resolve(__dirname, '..' , 'static', fileName))
                            await ReviewImage.create({path: path.resolve(__dirname, '..', 'static', fileName), reviewId: review.id});
                        })
                    }else{
                        const fileName = uuid.v4() + '.jpg';
                        img.mv(path.resolve(__dirname, '..' , 'static', fileName))
                        await ReviewImage.create({path: path.resolve(__dirname, '..', 'static', fileName), reviewId: review.id});
                    }
                    
                };
            }
            
            return res.json(review);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const review = await Review.findOne({where: {id}, include: [{model: ReviewImage, as: 'review_images'}]});
            return res.json(review);
        }
        catch(e){
            next(e.message);
        }
    }

    async getAll(req, res, next){
        try{
            const {userId, deviceId, rating} = req.query;
            let {limit, page} = req.query;
            limit = +limit;
            page = +page;
            const offset = limit * page - limit;
            let reviews;

            if(userId && deviceId && rating){
                reviews = await Review.findAndCountAll({where: {userId, deviceId, rating}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(userId && !deviceId && rating){
                reviews = await Review.findAll({where: {userId, rating}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(userId && deviceId && !rating){
                reviews = await Review.findAll({where: {userId, deviceId}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(userId && !deviceId && !rating){
                reviews = await Review.findAll({where: {userId}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            if(!userId && deviceId && rating){
                reviews = await Review.findAll({where: {deviceId, rating}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(!userId && !deviceId && rating){
                reviews = await Review.findAll({where: {rating}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(!userId && deviceId && !rating){
                reviews = await Review.findAll({where: {userId}, include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            }
            else if(!userId && !deviceId && !rating){
                reviews = await Review.findAll({include: [{model: ReviewImage, as: 'review_images'}], limit, offset});
            };

            res.json(reviews);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next){
        try{
            const {id} = req.user;
            const deviceId = req.params.id;
            const review = await Review.findOne({where: {userId: +id, deviceId}});
            const reviewImages = await ReviewImage.destroy({where: {reviewId: review.id}});
            await review.destroy();

            const device = await Device.findOne({where: {id: deviceId}, include: [{model: Review, as: 'reviews'}]})
            let totalScore = 0;
            device.reviews.forEach(rev => {
                totalScore += +rev.rating;
            });
            let newDeviceOverallRating = 0;
            if(device.reviews.length !== 0) {
                newDeviceOverallRating = (totalScore / device.reviews.length);
            };
            await device.update({overallRating: newDeviceOverallRating});

            res.json({review ,reviewImages});
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
};

module.exports = new ReviewController();