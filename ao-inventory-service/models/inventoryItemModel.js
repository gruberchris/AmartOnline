const mongoose = require('mongoose');

const InventoryItemModelSchema = new mongoose.Schema({
  itemId: { type: String, unique: true },
  description: String,
  quantity: Number,
  price: Number
});

InventoryItemModelSchema.statics.createInventoryItem = (payload, callback) => {
  let inventoryItemModel = new InventoryItemModel(payload);
  inventoryItemModel.save(callback);
};

const InventoryItemModel = mongoose.model('InventoryItem', InventoryItemModelSchema);

module.exports = InventoryItemModel;
