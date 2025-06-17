const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const isAuthenticated = require("./middlewares/auth");
const User = require("./model/user.model");

const server = express();


server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(expressLayouts);

// Express-session
server.use(session({
  secret: 'yourSecretKey', // Replace with real secret in prod
  resave: false,
  saveUninitialized: true
}));

//  Flash middleware
server.use(flash());
server.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
server.use("/", require("./routes/cart"));
server.use("/", require("./controllers/admin/admin.product.controller"));

// ===== Homepage =====
server.get("/", async (req, res) => {
  const Product = require("./model/product.model");
  const products = await Product.find();
  res.render("homepage", { products, cssFile: "/css/styles.css" });
});

server.get("/resume", (req, res) => {
  res.render("resume", { cssFile: "/resume_css/mystyle.css" });
});

server.get("/form", (req, res) => {
  res.render("form", { cssFile: "/form_css/style.css" });
});

server.get("/login", (req, res) => {
  res.render("login", { cssFile: "/auth_css/login.css" });
});

server.get("/register", (req, res) => {
  res.render("register", { cssFile: "/auth_css/register.css" });
});

server.get("/cart", isAuthenticated, (req, res) => {
  res.render("cart", { cart: req.session.cart || [], cssFile: "/css/cart.css" });
});

// ===== MongoDB =====
mongoose.connect("mongodb://localhost:27017/Warehouse")
  .then(() => {
    console.log("Connected to database");
  });

// ===== Register Logic =====
server.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    req.flash('error_msg', 'User already exists');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  req.flash('success_msg', 'Registered successfully! Please log in.');
  res.redirect('/login');
});

// ===== Login Logic =====
server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash('error_msg', 'Invalid email');
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error_msg', 'Invalid password');
    return res.redirect('/login');
  }

  req.session.user = { id: user._id, email: user.email };
  res.redirect("/");
});

// ===== Logout =====
server.get("/logout", (req, res) => {
  req.session.destroy(() => {
    req.flash('success_msg', 'Logged out successfully');
    res.redirect("/login");
  });
});

// ===== Start Server =====
server.listen(4000, () => {
  console.log("Server started at http://localhost:4000");
});
