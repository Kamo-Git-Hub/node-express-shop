module.exports = function(req, res, next){
    if(!req.session.isAutorized){
        return res.redirect('/auth/login')
    }
    next()
}
//зашита url от не аторизованного пользователя 
// если параметр сессии об авторизации не активен то
// автоматически происходит переключение на страницу login