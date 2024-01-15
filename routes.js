const express = require('express')
const routes = express.Router()
const path =require('path')
const {dbInit,accounts,products,orders,dashboard,ObjectId} = require('./mongoConfig')
const {mailOrder, resetPassword} = require('./mailer')
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const saltRounds = 10;


routes.post('/addCart',async(req,res)=>{
    const {cartItems} = req.body
    req.session.cartItems=cartItems
    await dashboard.updateOne({ name: 'dashBoardDetails'},{ $inc: {cartItems: 1 }})
    res.redirect('/')
})
routes.post('/checkOrder',async(req,res)=>{
    const {email} = req.body
    let result = await orders.find({email:email}).toArray()
    res.json(result)
})
routes.post('/colorSelect',(req,res)=>{
    if(!req.session.selectedColor){
        req.session.selectedColor=[]
    }
    req.session.selectedColor.push(req.body)
    res.redirect('back')
})
routes.get('/colorSelect',(req,res)=>{
    res.json(req.session.selectedColor||[])
})
routes.post('/updCart',(req,res)=>{
    const {cartItems} =req.body
    req.session.cartItems=cartItems
    res.redirect('/cart')
})
routes.get('/addCart',(req,res)=>{
    res.json(req.session.cartItems||[])
})
routes.get('/role',(req,res)=>{
    if(req.session.user){
        const user = req.session.user 
        res.json(user)
        return
    }
    res.redirect('back')
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
        console.log(order)
        await orders.insertOne(order)
        mailOrder(order)
        req.session.cartItems=[]
        res.redirect('/')
    } catch (error) {
        console.log(`Failed CheckOut ${fname} ${lname}`)
        console.log(error)
    }
})
routes.post('/forgotPassword',async(req,res)=>{
    let {email} = req.body
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    try {
        await accounts.updateOne({email},{$set:{
            resetPasswordToken : hashedToken,
            resetPasswordExpires : Date.now() + 3600000, // 1 hour
        }})
        resetPassword(resetToken,email)
        res.json('You will get an email with the reset link')    
    } catch (error) {
        console.log(error)
    }
    
})
routes.get('/reset-password/:token',(req,res)=>{
    let token = req.params.token
    res.render('resetPassword',{tokenplaceholder:token})
})
routes.post('/reset-password/:token', async (req, res) => {
    const user = await accounts.findOne({email:req.body.email});
    const tokenMatches = await bcrypt.compare(req.params.token, user.resetPasswordToken);
    if (!tokenMatches || Date.now() > user.resetPasswordExpires) {
        res.status(400).send('Password reset token is invalid or has expired.');
        return;
    }

    // Update Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        await accounts.updateOne({email:req.body.email},{$set:{
            password:hashedPassword,
            resetPasswordToken : undefined,
            resetPasswordExpires : undefined,
        }})   
        res.send('Password update succesfull')
    } catch (error) {
        console.log(error)
    }
});
routes.post('/login',async (req,res)=>{
    const {email,password,} = req.body
    let user
    try{
        user = await accounts.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username',wrongPass:''})
            return
        }
        if(!await bcrypt.compare(password, user.password)){
            res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
            return
        }  
        req.session.user = {role:user.role}
        
    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
      
    res.redirect('/')
})

routes.get('/allProducts',async(req,res)=>{
    let result = await products.find().toArray()
    res.json(result)
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
routes.get('/product/:id',async(req,res)=>{
    let {id} =req.params
    const product = await products.findOne({_id:new ObjectId(id)})
    let {image,catalogue,type,description,price,images,colors} = product
    let details={
        image,
        images:JSON.stringify(images),
        catalogue,
        type,
        description,
        price,
        colors:JSON.stringify(colors),
        items:JSON.stringify(product),
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
            await dashboard.updateOne({ name:'dashBoardDetails'},{ $inc: { visits: 1 }})
            req.session.visited=true
        }   
    } catch (error) {
        console.log(error)
    }
    res.sendFile(path.join(__dirname,'html','index.html'))
})
routes.get('/test',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','test.html'))
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
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let user ={
            name:`${firstname} ${lastname}`,
            email:email,
            password:hashedPassword,
            role:'user',
        }
        await accounts.insertOne(user)
    } catch(err) {
        res.status(500).send(`Sign in error ${err}`);
    }
    res.render('login',{wrongUser:'',wrongPass:''})
})
module.exports = {routes,dbInit}