var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    unique: true
  },
  description: String,
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  created: {
    type: Date,
    default: Date.now()
  }
});

exports.Category = mongoose.model('Category', schema);
