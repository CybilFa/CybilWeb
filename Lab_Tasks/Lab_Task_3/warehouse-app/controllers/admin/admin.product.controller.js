let express = require("express");
let controller = express.Router();
let Product = require("../../model/product.model");

controller.get("/admin/products/create", (req, res) => {
  return res.render("admin/products/create" , {cssFile : null});
});

controller.post("/admin/products/create", async (req, res) => {
  try {
    const data = req.body;
    const p = new Product(data);
    await p.save();
    return res.redirect("/");
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).send("Internal Server Error");
  }
  let data = req.body;

  let p = new Product(data);
//   p.title = data.title;
//   p.description = data.description;
//   p.price = data.price;
  await p.save();
  
  return res.redirect("/");
});

module.exports = controller;