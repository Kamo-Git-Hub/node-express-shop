const config = require("config")

module.exports = function(email){
    return{
        to:email,
        from:config.email_from,
        subject:"регтстрация",
        html:`
        <h1>Регистрация прошла успешна</h1>
        <hr/>
        <b>теперь у вас есть полный доступ к нащему магазину</b>
        <br/>
        <i>регестрация прошла через email ${email}</i>
        <b>перейти в <a href='${config.base_url}'>магазин</a>  </b>
        `
    }
}