const {Router} = require("express")
const Course = require("../models/course-model")
const urlSec = require('../middleware/url-secyurity')

const router = Router()

router.get("/",urlSec, async(req, res)=>{
    res.render('add',{
        isAdd:true,
        title:"add"
    })
})

router.post('/',urlSec, async(req, res)=>{
    const courses = new Course({
        title:req.body.title,
        price:req.body.price,
        img:req.body.img,
        userId:req.user
    })
    await courses.save()
    res.redirect('/courses')
})


module.exports  =router