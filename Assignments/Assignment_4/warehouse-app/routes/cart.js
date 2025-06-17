const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add to cart
router.post('/add-to-cart/:id', async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (!product) return res.status(404).send('Product not found');

  if (!req.session.cart) req.session.cart = [];

  const cart = req.session.cart;
  const existing = cart.find(item => item._id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ _id: productId, title: product.title, price: product.price, quantity: 1 });
  }

  res.redirect('/cart');
});


//cart view
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart', { cart, total });
});

//Checkout Page + Order placement
router.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('checkout', { cart, total });
});

const Order = require('../models/Order'); // Add this at the top if not already

// POST Checkout
router.post('/checkout', async (req, res) => {
  const { name, phone, address } = req.body;
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({
    user: req.session.user, // Save user info if logged in
    name,
    phone,
    address,
    items: cart,
    total,
    status: 'Pending'
  });

  await order.save();
  req.session.cart = [];
  res.redirect('/cart-success');
});

// GET success page
router.get('/cart-success', (req, res) => {
  res.send('Order placed successfully! <a href="/">Continue Shopping</a>');
});

// Remove item from cart
router.get('/remove-from-cart/:id', (req, res) => {
  req.session.cart = (req.session.cart || []).filter(item => item._id !== req.params.id);
  res.redirect('/cart');
});

module.exports = router;