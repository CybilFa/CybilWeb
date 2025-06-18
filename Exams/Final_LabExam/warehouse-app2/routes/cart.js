const express = require('express');
const router = express.Router();
const Product = require('../model/product.model');
const Order = require('../model/order.model');
const isAuthenticated = require('../middlewares/auth')

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


router.get("/cart", isAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render("cart", { cart, total, cssFile: "/css/cart.css" });
});


//Checkout Page + Order placement
router.get('/checkout',isAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('checkout', { cart, total,cssFile:null });
});

 

// POST Checkout
router.post('/checkout', async (req, res) => {
  const { name, email, address, phone } = req.body;
  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.status(400).send("Cart is empty");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const order = new Order({
      customer: {
        name,
        email,
        address,
      },
      items: cart.map(item => ({
        name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice: total,
      status: 'Pending',
    });

    await order.save();

    // Save order summary in session
    req.session.order = {
      name,
      email,
      address,
      total,
      date: new Date().toLocaleString(), 
    };

    req.session.cart = [];
    res.redirect('/cart-success');
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Failed to place order");
  }
});



// success page
router.get('/cart-success',isAuthenticated, (req, res) => {
  const order = req.session.order;

  if (!order) return res.redirect('/'); // fallback if no order in session

  // clear order 
  req.session.order = null;

  res.render('cart-success', {
    name: order.name,
    email: order.email,
    address: order.address,
    total: order.total,
    date: order.date,
    cssFile: null 
  });
});


// Remove item from cart
router.get('/remove-from-cart/:id', (req, res) => {
  req.session.cart = (req.session.cart || []).filter(item => item._id !== req.params.id);
  res.redirect('/cart');
});



module.exports = router;