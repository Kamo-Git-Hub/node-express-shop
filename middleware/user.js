const User = require('../models/user-model')

module.exports =async function(req, res, next){
    if(!req.session.user){
        return next()
    }
    req.user = await User.findById(req.session.user._id)
    next()
}

//после регистрации сессии пользрователь хранится в параметре session,
//но до него нельза достучатся через req.session.user,
//по этому переписываеим пользователя уже в существуюшую дерикторию
//req.user
//если в разделе сессии отсуствует пользователь, продолжаем функцию дальше
//в противном случае в разделе req.user 
//записываем пользователя с id и продолжаем функцию