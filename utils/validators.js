const {body} = require("express-validator")
const User = require("../models/user-model")


exports.registerValidators =[
    //1========================================================================================
    body("email").isEmail().withMessage("введите коректный email").custom(async(value,{req})=>{
        try{
            const user = await User.findOne({email:value})
            if(user){
                return Promise.reject("email уже занят")
            }
        }catch(e){
            console.log(e)
        }

    }),
    body("password","пароль должен быть минимум 6 символов").isLength({min:7, max:56}).isAlphanumeric(),
    body("confirm").custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error("пороли должны совпадать")
        }
        return true
    }),
    body("name").isLength({min:3}).withMessage("има должно быть минимум 3 символа"),
    
]


exports.courseValidate=[
body("title").isLength({min:3}).withMessage("минимальное каличество символов 3"),
body("price").isNumeric().withMessage("введите коректную цену"),
body("img", "поле img обязателен").isURL()


]



/*
отбрашаемся к body его полю email, и с помощю метода isEmail делаем проверку, 
если проверка не прошла с помощю withMessage отправляем сообщение об ошибке
далее создаем метод с помощю ключевого слово custom где получаем value(то что прописанно в строке)
и request. Проверяем есть ли хоть один пользователь с таким email
и если есть возвращаем promis с сообщением об ошибке
*/
