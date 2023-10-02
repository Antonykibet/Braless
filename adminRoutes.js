const express = require('express')
const admnRoute = express.Router()
const path =require('path')
const bodyParser = require('body-parser'); 
const {dbInit,flowerCollection,accountCollection, orders, dashboard} = require('./mongoConfig');
const { name } = require('ejs');
const { log } = require('console');
const { ObjectId } = require('mongodb');


function auth(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.send('intruder')
    }
}

admnRoute.use(bodyParser.text({ type: 'text/plain' }));
//admnRoute.use('/admin',auth)
admnRoute.get('/admin/dashboard', async (req,res)=>{
    const orderdItems = await orders.countDocuments()
    const {visits, cartItems} = await dashboard.findOne({_id:new ObjectId(`6517ac53474a5ac96b8de971`)})
    res.render('dashboard.ejs',{siteVisits:visits,carts:cartItems,checkouts:orderdItems})
})
admnRoute.get('/admin/orderdItems',async(req,res)=>{
    let items = await orders.find().toArray()
    res.json(items)
})

admnRoute.post('/admin/statusUpdate',async(req,res)=>{
    const {name, status:updStatus} = req.body
    console.log(name, updStatus)
    try {
        await orders.updateOne({name:name},{ $set: {status:updStatus}})
        console.log('Success')
        res.redirect('/admin/dashboard')   
    } catch (error) {
        console.log(error)
    }
})

module.exports = {admnRoute}