const {MongoClient, ObjectId} = require('mongodb')
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri)

let db = dbClient.db('flowerShop');
let flowerCollection = db.collection('flowers')
let accountCollection =  db.collection('accounts')

async function dbInit(){
    await dbClient.connect();
}

module.exports = {dbInit,flowerCollection,accountCollection}