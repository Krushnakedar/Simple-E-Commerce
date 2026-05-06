import express from "express";

import {
  login,
  logout,
  register,
  renderLoginForm,
  renderRegisterForm,
} from "../controllers/seller.js";

const Router = express.Router();

Router.route("/login").get(renderLoginForm).post(login);

Router.route("/register").get(renderRegisterForm).post(register);

Router.get("/logout", logout);

export default Router;
