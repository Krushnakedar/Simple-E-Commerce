//THIS IS THE ONE OF THE MOST IMPORTANT CONCEPT TO IMPLEMENTING SESSION AND DATABASE IN COMBINE WAY FOR CART SYSTEM
import Cart from "../model/cart.js";
import Product from "../model/product.js";

/**
 * Helper: Merge session cart into DB cart for a user after login
 */

export const mergeSessionCartToDB = async (userId, sessionCart) => {
  if (!sessionCart || sessionCart.length === 0) return;

  for (const item of sessionCart) {
    const existing = await Cart.findOne({
      product: item.product_id,
      user: userId,
    });

    if (existing) {
      // Update quantity
      existing.quantity += item.quantity;
      await existing.save();
    } else {
      // Create new cart item in DB
      await Cart.create({
        product: item.product_id,
        user: userId,
        quantity: item.quantity,
      });
    }
  }
};

/**
 * Show Cart Items
 */
export const showCartItems = async (req, res) => {
  if (req.user) {
    // If user just logged in, merge session cart
    if (req.session.cart && req.session.cart.length > 0) {
      await mergeSessionCartToDB(req.user.userId, req.session.cart);
      req.session.cart = []; // Clear session cart after merge
    }

    const AllCartItem = await Cart.find({ user: req.user.userId }).populate(
      "product"
    );

    return res.render("carts/index.ejs", {
      cartItems: AllCartItem,
      isUser: true,
    });
  } else {
    const sessionCart = req.session.cart || [];

    if (sessionCart.length === 0) {
      return res.render("carts/index.ejs", { cartItems: [], isUser: false });
    }

    const ids = sessionCart.map((item) => item.product_id);
    const cartProducts = await Product.find({ _id: { $in: ids } });

    // Merge sessionCart and product info
    const productMap = {};
    cartProducts.forEach((p) => (productMap[p._id] = p));

    const cartItems = sessionCart.map((item) => ({
      product: productMap[item.product_id],
      quantity: item.quantity,
    }));

    return res.render("carts/index.ejs", { cartItems, isUser: false });
  }
};

/**
 * Add a product to cart
 */
export const addToCart = async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    const existedCart = await Cart.findOne({
      product: id,
      user: req.user.userId,
    });

    if (!existedCart) {
      await Cart.create({
        product: id,
        user: req.user.userId,
        quantity: 1,
      });
    } else {
      existedCart.quantity += 1;
      await existedCart.save();
    }

    return res.redirect(`/products/${id}`);
  } else {
    if (!req.session.cart) req.session.cart = [];

    const item = req.session.cart.find((i) => i.product_id === id);
    if (item) {
      item.quantity += 1;
    } else {
      req.session.cart.push({ product_id: id, quantity: 1 });
    }
    req.flash("success", "You added New product from cart");

    return res.redirect(`/products/${id}`);
  }
};

/**
 * Increase quantity of a cart item
 */
export const addOne = async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    const existing = await Cart.findOne({
      product: id,
      user: req.user.userId,
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    }

    return res.redirect(`/products/carts/${req.user.userId}/show`);
  } else {
    if (!req.session.cart) req.session.cart = [];
    const item = req.session.cart.find((c) => c.product_id === id);
    if (item) item.quantity += 1;

    return res.redirect(`/products/carts/guest/show`);
  }
};

/**
 * Decrease quantity of a cart item
 */
export const removeOne = async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    const existing = await Cart.findOne({
      product: id,
      user: req.user.userId,
    });

    if (existing && existing.quantity > 1) {
      existing.quantity -= 1;
      await existing.save();
    }

    return res.redirect(`/products/carts/${req.user.userId}/show`);
  } else {
    if (!req.session.cart) req.session.cart = [];
    const item = req.session.cart.find((c) => c.product_id === id);
    if (item && item.quantity > 1) item.quantity -= 1;

    return res.redirect(`/products/carts/guest/show`);
  }
};

/**
 * Remove a product completely from cart
 */
export const removeFromCart = async (req, res) => {
  const { id } = req.params;

  if (req.user) {
    await Cart.findOneAndDelete({ product: id, user: req.user.userId });
    return res.redirect(`/products/carts/${req.user.userId}/show`);
  } else {
    if (!req.session.cart) req.session.cart = [];
    req.session.cart = req.session.cart.filter(
      (item) => item.product_id !== id
    );
    req.flash("success", "You removed your product from cart");

    return res.redirect(`/products/carts/guest/show`);
  }
};
