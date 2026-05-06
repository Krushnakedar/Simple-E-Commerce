import flash from "connect-flash";
import MongoStore from "connect-mongo"; //this is use for session data storage
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Then your existing code
dotenv.config();
// console.log("URI:", process.env.MONGO_URI);
import cartRouter from "./routes/carts.js";
import productRouter from "./routes/products.js";
import sellerRouter from "./routes/sellers.js";
import userRouter from "./routes/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ override: true });
mongoose.set("strictQuery", false);
console.log("URI:", process.env.MONGO_URI);

const app = express();
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
main()
  .then(() => {
    console.log("MONGO DB ATLAS is connected to server");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    secret: "mysecret",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  store, //mongostore
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // maxAge: 1000 * 60 * 60 * 24,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currentUser = req.session.userId;
  res.locals.cartArray = req.session.cart;
  res.locals.isSeller = req.session.isSeller;

  next();
});
// app.get("/", (req, res) => {
//   res.redirect("server is running successfully");
// });
app.use("/", productRouter);
app.use("/users", userRouter);
app.use("/sellers", sellerRouter);
app.use("/products", productRouter);
app.use("/products/carts", cartRouter);

app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
