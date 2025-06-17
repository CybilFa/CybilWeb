const mongoose = require('mongoose');

//  schema for an order
const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Status like 'Pending', 'Shipped', etc.
  createdAt: { type: Date, default: Date.now },
  orderDate: { type: Date, default: Date.now }, 
});

// Create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
