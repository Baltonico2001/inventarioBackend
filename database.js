const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "inventarioPapeleria";

async function conectarDB() {
  await client.connect();
  console.log(" Conectado a MongoDB en Docker!");
  return client.db(dbName);
}

module.exports = conectarDB;
