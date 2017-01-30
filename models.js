const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const inventoryItemSchema = mongoose.Schema({
  itemName: {type: String, required: true},
  unitPrice: Number,
  retailPrice: Number,
  balanceOnHand: {type: Number, required: true},
  requestedInventoryLevel: {type: Number, required: true},
  sold: Number,
  vendor: String
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = {InventoryItem};
