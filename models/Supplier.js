const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    lastname: { type: String, required: true }, 
    phone: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    company: { type: String, required: true },
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
