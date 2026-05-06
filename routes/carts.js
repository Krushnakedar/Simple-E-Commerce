import express from "express";

import {
  addOne,
  addToCart,
  removeFromCart,
  removeOne,
  showCartItems,
} from "../controllers/cart.js";

const Router = express.Router();
//for user
Router.post("/:id/add", addToCart);
Router.put("/:id/increase", addOne);
Router.put("/:id/decrease", removeOne);

Router.delete("/:id/remove", removeFromCart);
Router.get("/:id/show", showCartItems);

export default Router;
