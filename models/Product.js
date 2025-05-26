const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, //  Nombre obligatorio
    description: { type: String }, //  Descripción opcional
    price: { type: Number, required: true, min: 0 }, //  Precio no puede ser negativo
    stock: { type: Number, required: true, default: 0, min: 0 }, //  Stock con valor mínimo 0
    category: { type: String, required: true }, //  Categoría obligatoria
  },
  { timestamps: true }
); //  Agrega `createdAt` y `updatedAt` automáticamente

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
