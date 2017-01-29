const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  inventory: [
    {
      id: {
        type: Number
      },
      itemName: {
        type: String,
        required: true
      },
      unitPrice: {
        type: Number
      },
      retailPrice: {
        type: Number
      },
      balanceOnHand: {
        type: Number,
        required: true
      },
      requestedInventoryLevel: {
        type: Number,
        required: true
      },
      sold: {
        type: Number
      },
      vendor: {
        type: String,
        required: true
      }
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
