import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  quantity: {
    default: 1,
    type: Number,
    required: true,
  },
});

export default mongoose.model("Cart", cartSchema);
