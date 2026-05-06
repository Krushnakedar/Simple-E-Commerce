import jwt from "jsonwebtoken";

const JWT_SECRET = "mysecretkey";

export function verifyJWT(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("failure", "please login first");
    return res.redirect("/products");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
     next();
  } catch (err) {
    res.clearCookie("jwt");
    console.log(err);
    req.flash("failure", "Session expired. Login again");

    return res.redirect("/products");
  }
}
