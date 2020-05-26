module.exports ={
    ifeq(a,b, options){
        if(a==b){
            return options.fn(this)
        }
        return options.inverse(this)
    }
}

//создание метода для проверки на равенство в handlebars