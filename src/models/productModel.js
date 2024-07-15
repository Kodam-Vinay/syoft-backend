const { Schema, model } = require("mongoose");
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inventory_count: {
    type: Number,
    required: true,
  },
});
const ProductModel = model("Product", productSchema);
module.exports = ProductModel;
