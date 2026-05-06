import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  availability: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },

  imageUrl: {
    type: String,
  },
});
export default mongoose.model("Product", productSchema);
