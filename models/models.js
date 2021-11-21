const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "CLIENT"},
    contactEmail: {type: DataTypes.STRING},
    phoneNumber: {type: DataTypes.STRING}
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    totalPrice: {type: DataTypes.INTEGER, allowNull: false},
    completed: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const OrderDevice = sequelize.define('order_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, defaultValue: 1}
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('basket_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER}
})

const FavoriteList = sequelize.define('favorite_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const FavoriteListDevice = sequelize.define('favorite_list_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    vendorCode: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    shortDescription: {type: DataTypes.TEXT, allowNull: false},
    overallRating: {type: DataTypes.INTEGER, defaultValue: 0},
    quantity: {type: DataTypes.INTEGER, defaultValue: 0},
    price: {type: DataTypes.INTEGER, allowNull: false}
})

const DeviceImage = sequelize.define('device_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING, allowNull: false},
})

const DeviceCharacteristic = sequelize.define('device_characteristic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false}
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true}
})

const Subcategory = sequelize.define('subcategory', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true}
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true}
})

const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.TEXT, allowNull: false},
    rating: {type: DataTypes.INTEGER, allowNull: false} 
})

const ReviewImage = sequelize.define('review_image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING, allowNull: false},
})

const CategoryBrand = sequelize.define('category_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Review)
Review.belongsTo(User)

User.hasOne(FavoriteList)
FavoriteList.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

FavoriteList.hasMany(FavoriteListDevice)
FavoriteListDevice.belongsTo(FavoriteList)

Category.hasMany(Subcategory)
Subcategory.belongsTo(Category)

Category.hasMany(Device)
Device.belongsTo(Category)

Subcategory.hasMany(Device)
Device.belongsTo(Subcategory)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Review)
Review.belongsTo(Device)

Device.hasMany(DeviceImage, {as: "images"})
DeviceImage.belongsTo(Device)

Device.hasMany(DeviceCharacteristic, {as: "characteristics"})
DeviceCharacteristic.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(FavoriteListDevice)
FavoriteListDevice.belongsTo(Device)

Device.hasMany(OrderDevice)
OrderDevice.belongsTo(Device)

Review.hasMany(ReviewImage)
ReviewImage.belongsTo(Review)

Brand.belongsToMany(Category, {through: CategoryBrand})
Category.belongsToMany(Brand, {through: CategoryBrand})

Order.hasMany(OrderDevice)
OrderDevice.belongsTo(Order)



module.exports = {
    User, Basket, BasketDevice, FavoriteList, FavoriteListDevice, Brand, CategoryBrand, Category, 
    Subcategory, Device, DeviceCharacteristic, DeviceImage, Review, ReviewImage, Order, OrderDevice
}