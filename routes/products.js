import express from "express";

import { upload } from "../cloudConfig.js";
import {
  createProduct,
  deleteProduct,
  renderAllProduct,
  renderEditForm,
  renderNewForm,
  showProduct,
  showSellerProduct,
  updateProduct,
} from "../controllers/product.js";
import { verifyJWT } from "../middleware/auth.js";

const Router = express.Router();
//for both
Router.get("/", renderAllProduct);

//for Seller
Router.route("/new")
  .get(verifyJWT, renderNewForm)
  .post(verifyJWT, upload.single("imageUrl"), createProduct);

Router.get("/:id/seller", showSellerProduct);
Router.route("/:id")
  .get(showProduct)

  .put(verifyJWT, upload.single("imageUrl"), updateProduct)
  .delete(verifyJWT, deleteProduct);

Router.get("/:id/edit", verifyJWT, renderEditForm);

export default Router;
