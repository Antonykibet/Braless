const express = require('express')
const admnRoute = express.Router()
const path =require('path')
const bodyParser = require('body-parser'); 
const {dbInit,products,accountCollection, orders, dashboard} = require('./mongoConfig');
const { ObjectId } = require('mongodb');
const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination:function(req,file,cb){
         
        cb(null, path.join(__dirname, '/public/images'));
        },
        filename:function(req,file,cb){
            cb(null,file.originalname)
        }
    }
)
const upload = multer({storage})



function auth(req,res,next){
    let {role} = req.session.user || false
    if(role=='admin'){
        next()
        return
    }else{
        res.send('intruder')
    }
}

admnRoute.use(bodyParser.text({ type: 'text/plain' }));
admnRoute.use('/admin',auth)
admnRoute.get('/admin/dashboard', async (req,res)=>{
    const orderdItems = await orders.countDocuments()
    const {visits, cartItems} = await dashboard.findOne({name:'dashBoardDetails'})
    res.render('dashboard.ejs',{siteVisits:visits,carts:cartItems,checkouts:orderdItems})
})

admnRoute.post('/admin/create', upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'otherImages', maxCount: 5 }]), async (req, res) => {
    let {catalogue,type,price,description,topProduct,colorData}=req.body
    console.log(catalogue)
    topProduct = Boolean(topProduct)
    let mainFile = req.files.mainImage ? req.files.mainImage[0].filename : null
    let otherImages = req.files.otherImages ? req.files.otherImages.map(file=>file.filename) : null
    let product ={
        catalogue,
        type,
        price,
        description,
        colors:JSON.parse(colorData),
        top:topProduct,
        image: mainFile,
        images:otherImages,
        unit:1,
    }
    await products.insertOne(product)
    res.redirect('/admin/dashboard')
})

admnRoute.post('/admin/update', upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'otherImages', maxCount: 5 }]), async (req, res) => {
    let {_id,catalogue,type,price,description,topProduct,colorData}=req.body
    let mainFile = req.files.mainImage ? req.files.mainImage[0].filename : null
    let otherImages = req.files.otherImages ? req.files.otherImages.map(file=>file.filename) : null
    if(catalogue){
        await products.updateOne({_id: new ObjectId(_id)},{$set:{catalogue}})
    }
    if(type){
        await products.updateOne({_id: new ObjectId(_id)},{$set:{type:type}})
    }
    if(price){
        await products.updateOne({_id: new ObjectId(_id)},{$set:{price}})
    }
    if(description){
        await products.updateOne({_id: new ObjectId(_id)},{$set:{description}})
    }
    if(mainFile){
        await products.updateOne({_id: new ObjectId(_id)},{$set:{mainFile}})
    }
    if(otherImages){
        await products.updateOne({_id: new ObjectId(_id)},{ $addToSet: { arrayField: { $each: otherImages} }})
    }
    res.redirect('/admin/dashboard')
})
admnRoute.post('/admin/delete',async(req,res)=>{
    const {prodName} =req.body
    const filters =prodName.split(':')
    try {
        await products.deleteOne({catalogue:filters[0],type:filters[1]})   
    } catch (error) {
        console.log(`Product delete failed!!! ${error}`)
    }
    res.redirect('/admin/dashboard')
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