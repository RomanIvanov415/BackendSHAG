const ApiError = require('../error/apiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Basket, FavoriteList, Order } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'});
};

class UserController {
    async registration(req, res, next){
        try{
            const {email, password, role, name, contactEmail, phoneNumber} = req.body;
            if(!email || !password){
                return next(ApiError.badRequest('Некорректный E-mail или пароль'));
            };
            const candidate = await User.findOne({where: {email}});
            if(candidate){
                return next(ApiError.badRequest('Пользователь с таким E-mail уже существует'));
            };
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({email, role, password: hashPassword, name, contactEmail, phoneNumber});
            const basket = await Basket.create({userId: user.id});
            const favorite = await FavoriteList.create({userId: user.id});
            const token = generateJwt(user.id, user.email, user.role);
            return res.json(token);
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        };
    };
    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}});
            if(!user){
                return next(ApiError.internal('Пользователь не найден'));
            };
            let comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword){
                return next(ApiError.internal('Не указан пароль'));
            };
            const token = generateJwt(user.id, user.email, user.role);
            return res.json({token});
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        };
    };
    async auth(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role,);
        return res.json({token});
    };

    async getAll(req, res, next){
        try{
            const {role} = req.query;
            let users;
            if(role){
                users = await User.findAll({where: {role}, include: [{model: Order, as: 'orders'}]});
            }else{
                users = await User.findAll({include: [{model: Order, as: 'orders'}]});
            }

            return res.json(users);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    };

    async getOne(req, res, next){
        try{
            const {id} = req.params;
            const user = await User.findOne({where: {id}});
            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async updateUser(req, res, next){
        try{
            const {id} = req.params;
            const changes = req.body;
            const user = await User.update(changes, {where: {id}});

            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteUser(req, res, next){
        try{
            const {id} = req.params;
            const user = await User.destroy({where: {id}});

            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest(e.message));
        }
    }
};

module.exports = new UserController();