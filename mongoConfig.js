require('dotenv').config();
const {MongoClient, ObjectId} = require('mongodb')
const uri = process.env['MONGO_URL'];
const dbClient = new MongoClient(uri)

let db = dbClient.db('Braless');
let products = db.collection('products')
let accounts =  db.collection('accounts')
let orders = db.collection('Orders')
let agentsCollection = db.collection('pickupMtaani')
let adminConfigsCollection = db.collection('adminConfigs')
let dashboard =db.collection('dashboard')


async function dbInit(){
    try {
        await dbClient.connect();
        console.log(`db connected...`);
    } catch (error) {
        console.error(error)
    }
}

module.exports = {uri,dbInit,products,accounts,orders,dashboard,agentsCollection,adminConfigsCollection,ObjectId}