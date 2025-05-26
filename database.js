const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

async function conectarDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB!");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1); // Cierra la aplicación si la conexión falla
  }
}

module.exports = conectarDB;
