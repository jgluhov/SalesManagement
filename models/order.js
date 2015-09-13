var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  goods: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number
    }
  }],
  amount: Number,
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Order = mongoose.model('Order', schema);

