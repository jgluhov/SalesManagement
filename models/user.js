var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
  local : {
    name : {
      type: String,
      unique: true
    },
    password : String,
    admin: {
      type: Boolean,
      default: false
    },
    _orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }],
    created: {
      type: Date,
      default: Date.now()
    }
  }
});

schema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

exports.User = mongoose.model('User', schema);
