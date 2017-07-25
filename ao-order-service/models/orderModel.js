const mongoose = require('mongoose');

const OrderModelSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: String },
  customerEmail: String,
  itemQuantity: Number,
  total: Number,
  subtotal: Number,
  totalTax: Number,
  orderItems: [{itemId: String, description: String, quantity: Number, price: Number, tax: Number}]
});

OrderModelSchema.statics.createOrder = (payload, callback) => {
  let orderModel = new OrderModel(payload);
  orderModel.save(callback);
};

const OrderModel = mongoose.model('Order', OrderModelSchema);

module.exports = OrderModel;
