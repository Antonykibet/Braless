const express = require('express')
const admnRoute = express.Router()
const path =require('path')
const {dbInit,flowerCollection,accountCollection} = require('./mongoConfig')


function auth(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.send('intruder')
    }
}
//admnRoute.use('/admin',auth)
admnRoute.get('/admin/dashboard',(req,res)=>{
    res.render('dashboard.ejs')
})



module.exports = {admnRoute}