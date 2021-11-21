const ApiError = require('../error/apiError');

module.exports = function(req, res, next){
    const deviceId = (req.body.deviceId || req.params.deviceId);
    if(deviceId == req.user.id){
        next();
    }
    else{
        return res.status(403).json({message: 'Нет доступа'});
    }
};