const mongoose = require('mongoose');

const basketModelSchema = new mongoose.Schema({
  userId: { type: String, unique: true},
  items: [{ itemId: String, quantity: Number, price: Number, description: String, tax: Number }]
});

basketModelSchema.statics.createBasket = (basket, callback) => {
  let basketModel = new BasketModel(basket);
  basketModel.save(callback);
};

const BasketModel = mongoose.model('Basket', basketModelSchema);

module.exports = BasketModel;
