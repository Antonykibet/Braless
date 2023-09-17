const {MongoClient, ObjectId} = require('mongodb')
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri)

let db = dbClient.db('Braless');
let products = db.collection('products')
let accounts =  db.collection('accounts')

async function dbInit(){
    await dbClient.connect();
}

module.exports = {dbInit,products,accounts}