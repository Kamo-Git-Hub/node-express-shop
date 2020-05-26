const {Router} = require("express")

const router = Router()

router.get("/", async(req, res)=>{
    res.render('home',{
        isHome:true,
        title:"home"
    })
})


module.exports  =router