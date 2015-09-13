var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  name: {
    type: String,
    unique: true
  },
  description: String,
  cost: Number,
  created: {
    type: Date,
    default: Date.now()
  }
});

exports.Product = mongoose.model('Product', schema);
