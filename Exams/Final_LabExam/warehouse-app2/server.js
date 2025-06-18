const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const isAuthenticated = require("./middlewares/auth");
const User = require("./model/user.model");

const server = express();
server.use("/uploads", express.static("uploads")); 

server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(expressLayouts);

// Express-session
server.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: true
}));

// ===== Middleware =====
server.use(express.urlencoded({ extended: true }));

//  Flash middleware
server.use(flash());
server.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
server.use("/", require("./routes/loginSignup"));

server.use("/", require("./routes/cart"));
server.use("/", require("./routes/admin.product.controller"));

server.use("/",  require('./routes/wishlist'));
server.use("/",  require('./routes/complaint.routes'));


// ===== Homepage =====
server.get("/", isAuthenticated, async (req, res) => {
  const Product = require("./model/product.model");
  const products = await Product.find();
  res.render("homepage", { products, cssFile: "/css/styles.css" });
});

server.get("/home", (req, res) => {
  res.render("Home", { cssFile:"/css/styles.css" });
});


server.get("/resume", isAuthenticated, (req, res) => {
  res.render("resume", { cssFile: "/resume_css/mystyle.css" });
})



// server.get("/form", (req, res) => {
//   res.render("form", { cssFile: "/form_css/style.css" });
// });


// ===== MongoDB =====
mongoose.connect("mongodb://localhost:27017/cybil")
  .then(() => {
    console.log("Connected to database");
  });



// ===== Start Server =====
server.listen(4000, () => {
  console.log("Server started at http://localhost:4000");
});
