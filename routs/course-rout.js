const {Router} = require("express")
const Course = require('../models/course-model')
const urlSec = require('../middleware/url-secyurity')

const router = Router()
//1======================================================
function isOwner(course, req){
    return course.userId.toString()===req.user._id.toString()
}

router.get("/", async(req, res)=>{
    const courses = await Course.find()
    .populate("userId", "email name")
    .select("price title img")
    res.render('courses',{
        isCourses:true,
        title:"courses",
        courses:JSON.parse(JSON.stringify(courses)),
        //1==========================================
        userId:req.user?req.user._id.toString():null
    })
})


router.get('/:id',async(req, res)=>{
    const course = await Course.findById(req.params.id)
    res.render('course', {
        title:course.title,
        course:JSON.parse(JSON.stringify(course))
    })
})

router.get('/:id/edit',urlSec, async(req, res)=>{
    if(!req.query.mail){
        res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    //1=========================================================
    if(!isOwner(course, req)){
        return res.redirect('/courses')
    }
    res.render('edit',{
        title:course.title,
        isCart:true,
        course:JSON.parse(JSON.stringify(course))
    })
})


router.post('/edit',urlSec,async(req, res)=>{
   
    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses')
})

router.post('/update', async(req, res)=>{
    await Course.findByIdAndDelete({_id:req.body.id})
    res.redirect('/courses')
})

module.exports  =router





//1) проверка на пренадлежность, 
//с get параметром передаем userId, и проверяем, если пользователь активен
//передаем его id в виде страки если нет то передаем nuul
//далее создаем функцию которая принимает передаваемый обект и параметр req,
//в обоих есть id пользователя, и сравниваем их на точность
//после чего в параметре который мы хотим зашитить проверяем
//если функция с параметрами передаваемого обекта и req не активна 
//делаем redirect на другую строницу, 
//таким образом изменять и удалять обект может только тот кто его создал





