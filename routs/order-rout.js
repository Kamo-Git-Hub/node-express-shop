
const {Router} = require('express')
const Order = require('../models/order-model')
const urlSec = require('../middleware/url-secyurity')


const router = Router()

function mapOrders(orders){
    return orders.map(o=>({
        ...o._doc, 
        price:o.courses.reduce((total, i)=>{
            return total += i.count * i.course.price
        },0)
    }))
}

router.get('/',urlSec, async (req, res) => {
  try {
    const order = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')
    const orders = mapOrders(order)
    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
    orders:JSON.parse(JSON.stringify(orders))
      })
  } catch (e) {
    console.log(e)
  }
})


router.post('/',urlSec, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate()

    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      courses: courses
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }
})

module.exports = router





















// const {Router} = require("express")
// const Order = require('../models/order-model')

// const router = Router()

// function mapOrderItems(order){
//     return order.map(o=>({
//         ...o._doc,
//         price:o.courses.reduce((total, i)=>{
//             return total += i.count * i.course.price
//         },0)
//     }))
// }

// router.get("/", async(req, res)=>{
//     const order = await Order.find({"user.userId":req.user._id})
//     .populate("userId")
//     const orders = mapOrderItems(order)
//     res.render('orders',{
//         isOrders:true,
//         title:"orders",
//         orders:JSON.parse(JSON.stringify(orders))
//     })
// })

// router.post('/', async(req, res)=>{
//     const user = await req.user.populate("cart.items.courseId")
//     .execPopulate()
//     const courses = user.cart.items.map(c=>({
//         course:{...c.courseId._doc},
//         count:c.count
//     }))

//     const order = new Order({
//         user:{
//             name:req.user.name,
//         userId:req.user
//         },
//         courses
//     })
//     await req.user.clearCart()
//     await order.save()
//     res.redirect('/orders')
// })


// module.exports  =router