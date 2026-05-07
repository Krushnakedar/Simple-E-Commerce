import Product from "../model/product.js";

export const renderAllProduct = async (req, res) => {
  const allProduct = await Product.find({});
  res.render("products/index.ejs", { allProduct });
};

export const createProduct = async (req, res) => {
  const { name, description, price, availability, category } = req.body;

  const owner = req.user.userId;
  const existingProduct = await Product.findOne({ name, owner });
  if (existingProduct) {
    console.log("Your Product already exists");
    req.flash("failure", "Your product with same name already exists");
    return res.redirect("/products/new");
  }
  let imageUrl =
    "https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=";
  if (req.file) {
    imageUrl = req.file.path;
  }
  await Product.create({
    name,
    description,
    price,
    availability,
    category,
    owner,
    imageUrl,
  });
  req.flash("success", "New product created Successfully");

  return res.redirect("/products");
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  req.flash("failure", "Your product deleted Successfully");

  return res.redirect("/products");
};

export const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit.ejs", { product });
};

export const renderNewForm = (req, res) => {
  res.render("products/new.ejs");
};

export const showProduct = async (req, res) => {
  const { id } = req.params; // this is ownerId

  const product = await Product.findById(id).populate("owner");
  res.render("products/show.ejs", { product });
};
export const showSellerProduct = async (req, res) => {
  const { id } = req.params; // this is ownerId

  const allProduct = await Product.find({ owner: id });
  if (!allProduct) {
    allProduct = [];
    return res.render("products/index.ejs", { allProduct });
  }
  res.render("products/index.ejs", { allProduct });
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, availability, category, imageUrl } =
    req.body;

  if (req.file) {
    imageUrl = req.file.path;
  }
  let product = await Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    imageUrl,
    availability,
    category,
    imageUrl,
  }); //there is shortcut for abvoe code also { name, description, price, imageUrl, availability, category }
  req.flash("success", "Your product updated successfully");
  res.redirect(`/products/${id}`);
};
