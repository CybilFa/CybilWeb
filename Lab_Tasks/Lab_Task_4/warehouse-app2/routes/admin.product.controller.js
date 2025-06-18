let express = require("express");
let controller = express.Router();
let Product = require("../model/product.model");
const isAuthenticated = require('../middlewares/auth');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});
const upload = multer({ storage: storage });


// ======= CREATE PRODUCT =======

controller.get("/admin/products/create", isAuthenticated, (req, res) => {
  return res.render("admin/products/create", { cssFile: null });
});

controller.post(
  "/admin/products/create",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const p = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        picture: req.file ? req.file.filename : null,
      });

      await p.save();
      return res.redirect("/");
    } catch (err) {
      console.error("Error saving product:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);


// ======= EDIT PRODUCT =======

controller.get("/admin/products/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.render("admin/products/edit", {
      product,
      
      cssFile: null,
    });
  } catch (err) {
    console.error("Error fetching product for editing:", err);
    res.status(500).send("Error fetching product for editing.");
  }
});

controller.post(
  "/admin/products/edit/:id",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found.");
      }

      product.title = req.body.title;
      product.description = req.body.description;
      product.price = req.body.price;

      if (req.file) {
        product.picture = req.file.filename;
      }

      await product.save();
      res.redirect("/admin/products"); 
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).send("Error updating product.");
    }
  }
);


// ======= DELETE PRODUCT =======

controller.get("/admin/products/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
   res.redirect("/admin/products");

  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Error deleting product.");
  }
});

controller.get("/admin/products", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/products/products", { products , cssFile:null });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = controller;