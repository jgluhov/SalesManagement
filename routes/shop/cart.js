var _ = require('lodash');
var util = require('util');
var async = require('async');
var Order = require('../../models/order').Order;
var User = require('../../models/user').User;

var Product = require('../../models/product').Product;

exports.index = function (req, res, next) {
  switch (req.accepts(['html', 'json'])) {
    case 'html':
      req.breadcrumbs('Cart', req.originalUrl);
      res.render("shop/cart", {title: "Cart", breadcrumbs: req.breadcrumbs()});
      break;
    case 'json':
      async.map(req.session.cart, function (item, callback) {
        Product.findById(item.product_id, function (err, product) {
          callback(err, {product: product, quantity: item.quantity});
        });
      }, function (err, items) {
        if (err) return next(err);
        res.json({items: items});
      });
      break;
  }
};

exports.puts = function (req, res, next) {
  if (_.isUndefined(req.session.cart))
    req.session.cart = [];

  if (_.isEmpty(req.session.cart)) {
    req.session.cart.push({product_id: req.body.id, quantity: 1});
    return res.end();
  } else {
    var index = _.findIndex(req.session.cart, function (item) {
      return item.product_id == req.body.id;
    });
    if (index != -1) {
      req.session.cart[index].quantity++;
    } else {
      req.session.cart.push({product_id: req.body.id, quantity: 1});
    }
    res.end();
  }
};

exports.number = function (req, res, next) {
  var number = 0;

  if (_.isUndefined(req.session.cart)) {
    req.session.cart = [];
    return number;
  }

  function increase(product) {
    number += product.quantity;
  }

  if (!(_.isEmpty(req.session.cart)))
    _.map(req.session.cart, increase);

  res.json({number: number});
};

exports.checkout = function (req, res, next) {
  if (_.isUndefined(req.session.cart) || _.isEmpty(req.session.cart))
    return res.status(400).end();

  async.map(req.session.cart, function (item, callback) {
    Product.findById(item.product_id, function (err, product) {
      if(err) return next(err);
      callback(null, {product: product, quantity: item.quantity});
    });
  }, function (err, items) {
    var order = new Order();
    order._user = req.user;
    var amount = 0;

    items.forEach(function (item) {
      order.goods.push(item);
      amount += item.product.cost * item.quantity;
    });
    order.amount = amount;
    console.log(order);
    order.save(function (err) {
      if (err) return next(err);
      User.findById(req.user._id, function (err, user) {
        user.local._orders.push(order);
        user.save(function (err) {
          if (err) return next(err);
          getOrders(req.user._id, function(orders) {
            res.json({orders: orders});
          })
        });
        req.session.cart = [];
      });
    });
  });
};

exports.orders = function(req, res, next) {
  getOrders(req.user._id, function(orders) {
    res.json({orders: orders});
  })
};

function getOrders(id, callback) {
  process.nextTick(function () {
    User.findById(id).populate("local._orders").exec(function(err, user){
      if(err) throw err;
      async.map(user.local._orders, function(order, callback){
        Order.findById(order._id).populate("goods.product").exec(function(err, order) {
          callback(err, order);
        })
      }, function(err, orders) {
        if(err) throw err;
        callback(orders)
      });
    });
  })
};