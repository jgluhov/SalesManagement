var express = require('express');
var router = express.Router();

var categories = require('./categories');
var products = require('./products');

router.get('/', function (req, res, next) {
  res.render('admin/index', {title: 'Dashboard'});
});

router.get('/categories', categories.index);
router.get('/categories/new', categories.new);
router.post('/categories', categories.create);
router.get('/categories/:id/edit', categories.edit);
router.get('/categories/:id', categories.show);
router.put('/categories/:id', categories.update);
router.delete('/categories/:id', categories.delete);

router.get('/products/new', products.new);
router.post('/products', products.create);
router.get('/products/:id/edit', products.edit);
router.get('/products/:id', products.show);
router.put('/products/:id', products.update);
router.delete('/products/:id', products.delete);

module.exports = router;