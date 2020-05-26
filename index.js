const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const config = require("config")
const path = require("path")
const session = require('express-session')
const flash = require("connect-flash")
const MongoStore = require("connect-mongodb-session")(session)



const app = express()




//meddlaveres
//1)=======================================
const store = new MongoStore({
collection:"session",
uri:config.MONGO_URI
})
//2======================================
app.use(session({
    secret:config.SECTRET,
    resave:false,
    saveUninitialized:false,
    store
}))
//3===============================================
app.use(flash())

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:true}))
app.use(require('./middleware/login-middleware'))
app.use(require('./middleware/user'))



const hbs = exphbs.create({
    defaultLayout:"main",
    extname:"hbs",
    //4===========================================
    helpers: require('./utils/hbs-helpers')
})

app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views")




app.use('/', require('./routs/home-rout'))
app.use('/courses', require('./routs/course-rout'))
app.use('/add', require('./routs/add-rout'))
app.use('/auth', require('./routs/auth-rout'))
app.use('/cart', require('./routs/cart-rout'))
app.use('/orders', require('./routs/order-rout'))


async function start(){
    try{
        mongoose.connect(config.MONGO_URI,{
                useFindAndModify:false,
                useUnifiedTopology:true,
                useNewUrlParser:true
        })
        app.listen(config.PORT, ()=>{
            console.log(`connection port ${config.PORT}...`)
        })
    }catch(e){
        console.log(e)
    }
}

start()


// //1) создание stor где будет хранится session 
//  {const MongoStore = require("connect-mongodb-session")(session)}


// 2)подключение session {const session = require('express-session')}


// 3) flas модуль для подключения сообщений для ошибок/подсказок
// {const flash = require("connect-flash")}



// 4)вспомогательный helper для handlebars, логика импртрируется
// из './utils/hbs-helpers'

