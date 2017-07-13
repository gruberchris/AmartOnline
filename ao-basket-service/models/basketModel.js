const mongoose = require('mongoose');

const basketModelSchema = new mongoose.Schema({
  basketId: { type: String, unique: true },
  items: [{ itemId: String, quantity: Number }]
});

basketModelSchema.statics.createBasket = (basket, callback) => {
  let basketModel = new BasketModel(basket);
  basketModel.save(callback);
};

const BasketModel = mongoose.model('Basket', basketModelSchema);

module.exports = BasketModel;