const express = require('express')
const {routes,dbClient} = require('./routes.js')
const {dbInit,uri,} =require('./mongoConfig.js')
const {admnRoute} = require('./adminRoutes.js')
const sessions = require('express-session')
const mongoDbSession =require('connect-mongodb-session')(sessions)
const app = express()
const PORT=3500

const mongoStore = new mongoDbSession({
    uri:uri,
    collection:'sessions',
})

//mongoStore.on('error',(error)=>{
  //  console.error('mongoDb session store down !!',error)
//})
app.use(sessions({
        secret:'sayMyName',
        resave:false,
        saveUninitialized:false,
        //store:mongoStore,
        cookie:{
            name: 'braless',
            secure:false,//set to true in production
            maxAge:1000*60*60*24,
        }
    }
))
app.use(express.static('./public'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)
app.use(admnRoute)



app.listen(PORT, async () => {
    try {
        await dbInit();
        console.log(`db connected...`);
        console.log(`Server listening at Port ${PORT}...`);
    } catch (error) {
        console.error("Error initializing the database:", error);
    }
});
