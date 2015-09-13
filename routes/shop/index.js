var express = require('express');
var router = express.Router();
var _ = require('lodash');
var cart = require('./cart');
var Product = require('../../models/product').Product;

router.get('/products', function(req, res, next) {
  Product.find({}).populate("_category").exec(function(err, products) {
    if(err) return next(err);
    res.json({products: _.chunk(products, 3)});
  })
});

router.get('/cart', cart.index);
router.post('/cart/puts', cart.puts);
router.get('/cart/number', cart.number);
router.get('/cart/checkout', cart.checkout);
router.get('/cart/orders', cart.orders);

module.exports = router;