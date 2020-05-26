const {Router} = require("express")
const Course = require('../models/course-model')
const router = Router()

function mapCartItems(cart){
    return cart.items.map(c=>({
        ...c.courseId._doc, count:c.count
    }))
}


function reducePrice(course){
    return course.reduce((total, i)=>{
        return total += i.count*i.price
    },0)
}


router.get("/", async(req, res)=>{
    const user = await req.user.populate("cart.items.courseId")
    .execPopulate()
    const courses = mapCartItems(user.cart)
    const price = reducePrice(courses)
    res.render('cart',{
        isCart:true,
        title:"cart",
        course:JSON.parse(JSON.stringify(courses)),
        price:JSON.parse(JSON.stringify(price))
    })
})


router.post('/add', async(req, res)=>{
    const courses = await Course.findById(req.body.id)
    await req.user.addToCart(courses)
    res.redirect('/cart')
})



router.delete('/remove/:id', async(req, res)=>{
    await req.user.removeToCArt(req.params.id)
    const user = await req.user.populate("cart.items.courseId")
    .execPopulate()

    const courses = mapCartItems(user.cart)

    const cart={
        courses, price:reducePrice(courses)
    }

    res.json(cart)

})

module.exports  =router