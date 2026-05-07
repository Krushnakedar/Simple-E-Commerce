import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../model/user.js";
const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    req.flash("failure", "User does not exist");
    return res.redirect("/users/login");
  }

  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    req.flash("failure", "Invalid password.Please try again");

    return res.redirect("/users/login");
  }

  const jwtToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("jwt", jwtToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  user.token = jwtToken;
  await user.save();
  req.session.userId = user._id;
  req.session.isSeller = false;

  req.flash("success", "Login successful");
  return res.redirect("/products");
};

export const renderLoginForm = async (req, res) => {
  return res.render("users/login.ejs");
};

export const register = async (req, res) => {
  const { username, email, password, address } = req.body;
  const existing = await User.findOne({ username });

  if (existing) {
    req.flash("failure", "username User already exists");
    return res.redirect("/users/register");
  }
  const hashed = await hash(password, 10);

  await User.create({ username, email, password: hashed, address });
  req.flash("success", "Registered successfully");
  return res.redirect("/users/login");
};

export const renderRegisterForm = async (req, res) => {
  return res.render("users/register.ejs");
};

export const logout = async (req, res) => {
  req.flash("success", "You log out successfully");

  res.clearCookie("jwt");

  req.session.destroy((err) => {
    if (err) {
      console.log("session destroy error: ", err);
      return res.redirect("/products");
    }
    return res.redirect("/users/login?logout=success");
  });
};
