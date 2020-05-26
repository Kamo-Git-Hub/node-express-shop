const config = require("config")

module.exports = function(email, token){
    return{
        to:email,
        from:config.email_from,
        subject:"востановление пароли",
        html:`
        <h1>Забыли пароль?</h1>
        <hr/>
        <b>ксли нет то проигнорируйте данное сообщение</b>
        <br/>
        <p>иначе нажмите на ссылку <a href='${config.base_url}/auth/password/${token}'>магазин</a> </p>
        `
    }
}