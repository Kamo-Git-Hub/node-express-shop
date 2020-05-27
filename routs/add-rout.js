const {Router} = require("express")
const Course = require("../models/course-model")
const urlSec = require('../middleware/url-secyurity')
const {validationResult}= require("express-validator")
const {courseValidate}= require("../utils/validators")

const router = Router()

router.get("/",urlSec, async(req, res)=>{
    res.render('add',{
        isAdd:true,
        title:"add"
    })
})

router.post('/',urlSec,courseValidate, async(req, res)=>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.render('add',{
            isAdd:true,
            title:"add",
            error:error.array()[0].msg,
            data:{
                title:req.body.title,
        price:req.body.price,
        img:req.body.img,
            }
        })
    }

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