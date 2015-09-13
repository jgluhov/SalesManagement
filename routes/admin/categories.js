var async = require('async');
var path = require('path');
var Category = require('../../models/category').Category;

exports.index = function (req, res, next) {
  Category.find({}, function (err, categories) {
    if (err) return next(err);
    switch (req.accepts(['html', 'json'])) {
      case 'html':
        req.breadcrumbs('Categories', req.originalUrl);
        res.render('admin/categories/index', {
          title: "Categories",
          categories: categories,
          breadcrumbs: req.breadcrumbs()
        });
        break;
      case 'json':
        res.json({categories: categories});
      break;
    }
  });
};

exports.create = function (req, res, next) {
  var category = new Category({
    name: req.body.name,
    description: req.body.description
  });
  category.save(function (err) {
    if (err) return next(err);
    res.json({category: category});
  });
};

exports.new = function (req, res) {
  res.render('admin/categories/new', {title: "New category"})
};

exports.edit = function (req, res, next) {
  Category.findOne({_id: req.params.id}, function (err, category) {
    if (err) return next(err);
    res.render('admin/categories/edit', {title: "Edit category", category: category});
  });
};

exports.show = function (req, res, next) {
  Category.findOne({_id: req.params.id}).populate("products").exec(function (err, category) {
    if (err) return next(err);
    switch (req.accepts(['html', 'json'])) {
      case 'html':
        req.breadcrumbs('Categories', path.parse(req.originalUrl).dir);
        req.breadcrumbs(category.name, req.originalUrl);
        res.render('admin/categories/show', {
          title: "Category",
          category: category,
          breadcrumbs: req.breadcrumbs()
        });
        break;
      case 'json':
        res.json({category: category});
        break;
    }
  });
};

exports.update = function (req, res, next) {
  Category.findOneAndUpdate({_id: req.params.id}, {
    name: req.body.name,
    description: req.body.description
  }, {new: true}, function (err, category) {
    if (err) return next(err);
    res.json({category: category});
  });
};

exports.delete = function (req, res, next) {
  Category.findByIdAndRemove(req.params.id).populate("products").exec(function(err, category) {
    if(err) return next(err);
    async.map(category.products, function(product, callback) {
      product.remove(callback)
    }, function(err){
      if(err) return next(err);
      res.end();
    });
  });
};


