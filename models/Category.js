const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, 
    description: { type: String }, 
    origin: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
