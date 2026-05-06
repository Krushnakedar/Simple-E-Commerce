import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
});
export default mongoose.model("Seller", sellerSchema);
