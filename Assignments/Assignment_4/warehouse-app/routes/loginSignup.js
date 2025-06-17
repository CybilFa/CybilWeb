let express = require("express");
let controller = express.Router();
let User = require("../model/user.model");
const bcrypt = require('bcrypt')

controller.get("/login", (req, res) => {
  res.render("login", { cssFile: "/auth_css/login.css" });
});

controller.get("/register", (req, res) => {
  res.render("register", { cssFile:  "/auth_css/register.css" });
});




// ===== Register Logic =====
controller.post("/register", async (req, res) => {
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
controller.post("/login", async (req, res) => {
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
controller.get("/logout", (req, res) => {
  req.session.destroy(() => {
    req.flash('success_msg', 'Logged out successfully');
    res.redirect("/login");
  });
});

module.exports = controller;