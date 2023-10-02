const express = require('express')
const routes = express.Router()
const path =require('path')
const {dbInit,accounts,products,orders,dashboard,ObjectId} = require('./mongoConfig')

routes.post('/addCart',async(req,res)=>{
    const {cartItems} = req.body
    req.session.cartItems=cartItems
    await dashboard.updateOne({ _id: new ObjectId('6517ac53474a5ac96b8de971')},{ $inc: {cartItems: 1 }})
    res.redirect('/')
})
routes.post('/checkOrder',async(req,res)=>{
    const {phonenumber} = req.body
    let result = await orders.find({phoneNo:phonenumber}).toArray()
    console.log(``)
    res.json(result)
})
routes.post('/updCart',(req,res)=>{
    const {cartItems} =req.body
    req.session.cartItems=cartItems
    res.redirect('/cart')
})
routes.get('/addCart',(req,res)=>{
    res.json(req.session.cartItems)
})
routes.get('/role',(req,res)=>{
    if(req.session.user){
        const {role} = req.session.user 
        res.json(role)
        return
    }
    
})
routes.post('/checkout',async(req,res)=>{
    
    try {
        const {fname,lname,phoneNo,email,totalPrice} = req.body
        const cart = req.session.cartItems
        let order ={
            name:`${fname} ${lname}`,
            phoneNo,
            email,
            totalPrice,
            status:'processing',
            cart,
        }
        await orders.insertOne(order)
        req.session.cartItems=[]
        res.redirect('/')
    } catch (error) {
        console.log(`Failed CheckOut ${fname} ${lname}`)
        console.log(error)
    }
})
routes.post('/login',async (req,res)=>{
    const {email,password} = req.body
    let user
    try{
        user = await accounts.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username',wrongPass:''})
            return
        }

    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
    if(user.password !== password){
        res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
        return
    }
    if(email=='antonykibet059@gmail.com' && password=='123@Anto'){
        res.cookie('braless', 'boss', { maxAge: 1000*60*60*24});
        req.session.user = {email,role:'Admin'}
    }     
    res.redirect('/')
})

routes.get('/category/:page',async (req,res)=>{
    const {page} = req.params
    collection= await db.collection('flowers');
    // let product = await collection.findOne({catalogue:page})
     await res.render('page',{title:page})

})

routes.get('/allProducts',async(req,res)=>{
    let result = await products.find().toArray()
    res.json({result})
})

routes.get('/flower',(req,res)=>{
    // res.sendFile(path.join(__dirname,'/product.html'))
    readFile('product.html','utf-8',(err,html)=>{
        if(err){
            res.status(404).sendFile(path.join(__dirname,'/fail.html'))
            return
        }
        res.send(html)
    })
})
routes.get('/topProducts',async(req,res)=>{
    let result = await products.find({top:true}).toArray()
    res.json(result)
})
routes.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    let result = await products.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
routes.get('/product/:productName',async(req,res)=>{
    let {productName} =req.params
    let {image,name,description,price,images} = await products.findOne({name:`${productName}`})
    let details={
        image:image,
        images:JSON.stringify(images),
        name:name,
        description:description,
        price:price
    }
    await res.render('product',details)
})
routes.get('/getFlowers',async (req,res)=>{
    let result = await products.find().toArray()
    res.json(result)
})
routes.get('/',async(req,res)=>{
    try {
        if(!req.session.visited){
            console.log(`updated`)
            await dashboard.updateOne({ _id: new ObjectId('6517ac53474a5ac96b8de971')},{ $inc: { visits: 1 }})
            req.session.visited=true
        }   
    } catch (error) {
        console.log(error)
    }
    res.sendFile(path.join(__dirname,'html','index.html'))
})
routes.get('/cart',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','cart.html'))
})
routes.get('/track',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','track.html'))
})
routes.get('/login',(req,res)=>{
    res.render('login',{wrongUser:'',wrongPass:''})
})

routes.get('/signUp',(req,res)=>{
    res.render('sign',{error:''})
})
routes.post('/signUp',async(req,res)=>{
    const {firstname,lastname,email,password} = req.body
    if( await accounts.findOne({email:email})){
        res.render('sign',{error:'Email already exists!'})
        return
    }
    let user ={
        name:`${firstname} ${lastname}`,
        email:email,
        password:password,
    }
    await accounts.insertOne(user)
    console.log('Success')
    res.render('login',{wrongUser:'',wrongPass:''})
})
module.exports = {routes,dbInit}