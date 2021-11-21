require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const fileUpload = require('express-fileupload')
//const multipart = require('connect-multiparty')
const path = require('path')
const models = require('./models/models')
const PORT = process.env.PORT || 5000
const app = express()
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')

app.use(cors())
app.use(express.json())
//app.use(express.urlencoded({extended: true}))
//app.use(multipart())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)


const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log('Всё работает на порту ' + PORT)
        })
    }catch(e){
        console.log(e)
    }
}

start()

//40.00

