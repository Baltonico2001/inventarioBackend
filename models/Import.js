const mongoose = require("mongoose");

const importationSchema = new mongoose.Schema(
  {
    product: {type: String,required: true,}, 
    quantity: { type: Number, required: true }, 
    value: { type: Number, required: true }, 
    origin: { type: String, required: true }, 
    client: { type: String, required: true }, 
    importDate: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

const Importation = mongoose.model("Importation", importationSchema);
module.exports = Importation;
