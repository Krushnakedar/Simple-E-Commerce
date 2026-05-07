import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

import Seller from "../model/seller.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  let { username, password } = req.body;
  let user = await Seller.findOne({ username });
  if (!user) {
    req.flash("failure", "Seller does not exist");
    return res.redirect("/sellers/login");
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    req.flash("failure", "Invalid password.Please try again");
    return res.redirect("/sellers/login");
  }

  const jwtToken = jwt.sign(
    { userId: user._id, username: user.username },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
  res.cookie("jwt", jwtToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  user.token = jwtToken;
  await user.save();
  req.session.userId = user._id;
  req.session.isSeller = true;

  req.flash("success", "Welcome to our Platform");
  return res.redirect("/products");
};

export const renderLoginForm = (req, res) => {
  return res.render("sellers/login.ejs");
};

export const register = async (req, res) => {
  let { username, password, company, companyEmail, address } = req.body;
  let existing = await Seller.findOne({ username });

  if (existing) {
    req.flash("failure", "Seller already exists");
    return res.redirect("/sellers/register");
  }

  const hashed = await hash(password, 10);

  await Seller.create({
    username,
    company,
    companyEmail,
    address,
    password: hashed,
  });
  req.flash("success", "Registered successfully");
  return res.redirect("/sellers/login");
};
export const renderRegisterForm = (req, res) => {
  return res.render("sellers/register.ejs");
};

export const logout = (req, res) => {
  req.flash("success", "You log out successfully");
  res.clearCookie("jwt");
  req.session.destroy((err) => {
    if (err) {
      console.log("session destroy error", err);
      return res.redirect("/products");
    }

    return res.redirect("/sellers/login?logout=success");
  });
};
