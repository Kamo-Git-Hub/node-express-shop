const {Router} = require("express")
const User = require('../models/user-model')
const nodemailer = require('nodemailer')
const sengrid = require("nodemailer-sendgrid-transport")
const bcrypt = require("bcryptjs")
const config = require("config")
const regEmail = require('../email/reg-email')
const crypto = require("crypto")
const resetEmeil = require('../email/reset')

const router = Router()

// 1==================================
const transporter = nodemailer.createTransport(sengrid({
    auth:{api_key:config.send_grid_api_key}
}))



router.get("/login", async(req, res)=>{
    res.render('auth/login',{
        isLogin:true,
        title:"login",
        error:req.flash("error"),
        logError:req.flash("logError")
    })
})

router.post('/login', async(req, res)=>{
    
    const {password, email}= req.body
    const candidate = await User.findOne({email})
    if(candidate){
        //2==============================================================
        const pass = await bcrypt.compare(password, candidate.password)
        if(pass){
            req.session.user = candidate
            req.session.isAutorized= true
            req.session.save(err=>{
                if(err) {
                    throw err
                }else{
                  res.redirect('/')
                }
            })
            
        }else{
            req.flash("logError","не верный логин или пароль")
        res.redirect('/auth/login') 
        }
    }else{
        req.flash("logError","не верный логин или пароль")
        res.redirect('/auth/login') 
    }
    
})

router.get('/logaut',(req, res)=>{
    //3=====================================
    req.session.destroy(()=>{
        res.redirect('/auth/login')
    })
})


router.post('/register', async(req, res)=>{
    const {email, password, name} = req.body
    const candidat = await User.findOne({email})
    //2=================================================
    const hashBycript = await bcrypt.hash(password, 12)
    if(candidat){
        req.flash("error","пользователь с таким email уже существует")
        res.redirect('/auth/login#register')
    }else{
        const user = new User({email, password:hashBycript, name, cart:{items:[]}})
        await user.save()
        res.redirect('/auth/login')
        //1============================================
        await transporter.sendMail(regEmail(email))
    }
    
    
})


router.get('/reset',(req, res)=>{
    res.render('auth/reset',{
        title:"забыли пароль?",
        error:req.flash("error")
    })
})

//4===================================================================================
router.post('/reset', (req, res)=>{
    try{
        crypto.randomBytes(32,async (err, buffer)=>{
            if(err){
                req.fresh("error","что то пошло не так")
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({email:req.body.email})
            if(candidate){
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now()+60*60*1000
                await candidate.save()
                //1=============================================================
                await transporter.sendMail(resetEmeil(candidate.email, token))
                res.redirect("/auth/login")
            }else{
                req.flash("error", "такого email нет")
                return res.redirect('/auth/reset')
            }
        })

    }catch(e){
        console.log(e)
    }
})

//5==================================================================================
router.get('/password/:token', async(req, res)=>{
 try{
    if(!req.params.token){
        return res.redirect('/auth/login')
    }

    const user = await User.findOne({
        resetToken:req.params.token,
        resetTokenExp:{$gt:Date.now()}
    })
    if(!user){
        return res.redirect('/auth/login')
    }else{
        res.render('auth/password',{
            title:"new password",
            error:req.flash("error"),
            userId:user._id.toString(),
            token:req.params.token
        })
    }

    
 }catch(e){
     console.log(e)
 }
})
//6===================================================================================

router.post('/password', async(req, res)=>{
    try{
const user = await User.findOne({
    _id:req.body.userId,
    resetToken:req.body.token,
    resetTokenExp:{$gt:Date.now()}
})
if(user){
    //2===========================================================
    user.password = await bcrypt.hash(req.body.password,12)
    user.resetToken = undefined,
    user.resetTokenExp= undefined
    await user.save()
    res.redirect('/auth/login')
}else{
    req.flash("logError", "токен не действителен")
    res.redirect("/auth/login")
}
    }catch(e){
        console.log(e)
    }
})


module.exports  =router








 //1) транспортация email, установка {const nodemailer = require('nodemailer')
// const sengrid = require("nodemailer-sendgrid-transport")}
//api_key принимает ключь из библиотеки nodemailer, в коде ключь находится в config
//transporter.sendMail(функция находится в папке email,
//  каждому из них отправляются данные которые должны обработатся при отправке сообщения) 


//2) bcrypt установка {const bcrypt = require("bcryptjs")} = для зашиты пароля на стороне сервера
// создается с помощю hash первым параметром принимает password из body, а второй параметр указывает 
//на количество символов для защиты
//в логине с помощю bcrypt.compare(password, candidate.password) сравниваем пароль
// метод всегда возвращает промис 

//3) завершает сессию


//4) отрправка запроса на востоновление пароли
//crypto встроеная библиотека в node.js которая генерирует случайный ключь
//crypto.randomBytes(32,async (err, buffer) первый параметр это длина ключа
//далее принимаем потенциальную ошибку и bufer, 
// после обработки ошибки  переводим buffer в строковый формат и передаем формат 'hex'
//из module принимаем 2 параметра resetTokenб resetTokenExp =которые создаются автоматически
//при запроса на востановление пароли. resetTokenб = хранит в себе сгенерированый ключь
// resetTokenExp время жизни токена



//5) после получения сообщения в email мы переходим по ссылке
//первым делом проверяем если у ссылки отсуствует token то выдаем ошибку, 
//либо переправляем в на другую страницу
// далее проверяем ползователя с наличием определенных данных
// в поле resetToken должен быть токен
//resetTokenExp  время жизни токена должно быть активным, проверяется через $gt
//если нет такого пользователя выдаем ошибку либо redirect
// если да то передаем  id пользователя и токен в форму для востановлении пароля
// где их выводим в input hidden



//6) генерация нового пароля
// после отправки находим пользователя с наличием id, resetToken и с активным resetTokenExp
//далее если он присутствует пользователю задаем новфй пароль
//и обнуляем временные данные resetToken = undefined, resetTokenExp= undefined у пользователя
//и в данном виде сохраняем нового ползователя
    





