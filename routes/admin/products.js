var async = require('async');
var Category = require('../../models/category').Category;
var Product = require('../../models/product').Product;

exports.new = function (req, res) {
  res.render('admin/products/new', {title: "New product"})
};

exports.create = function (req, res, next) {
  async.waterfall([
    function (callback) {
      Category.findOne({_id: req.body.category}, function (err, category) {
        if (err) return next(err);
        callback(null, category);
      });
    },
    function (category, callback) {
      var product = new Product({
        _category: category,
        name: req.body.name,
        description: req.body.description,
        cost: req.body.cost
      });
      product.save(function (err) {
        if (err) return next(err);
        callback(null, category, product);
      });
    },
    function (category, product, callback) {
      category.products.push(product);
      category.save(function (err) {
        if (err) return next(err);
        callback(null, product)
      });
    }
  ], function (err, product) {
    if (err) return next(err);
    res.json({product: product});
  });
};

exports.edit = function (req, res, next) {
  Product.findOne({_id: req.params.id}).populate('_category').exec(function (err, product) {
    if (err) return next(err);
    res.render('admin/products/edit', { title: "Edit category", product: product });
  });
};

exports.update = function (req, res, next) {
  Product.findOneAndUpdate({_id: req.params.id}, {
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost
  }, {new: true}, function (err, product) {
    if (err) return next(err);
    res.json({product: product});
  });
};

exports.show = function (req, res, next) {
  Product.findOne({_id: req.params.id}).populate("_category").exec(function (err, product) {
    if (err) return next(err);
    res.json({product: product});
  });
};

exports.delete = function (req, res, next) {
  Product.findOneAndRemove({_id: req.params.id}, function (err, product) {
    if (err) return next(err);
    Category.findByIdAndUpdate(product._category, {$pull: {products: product._id}}, function (err) {
      if (err) return next(err);
      res.end();
    });
  });
};

