var express = require('express');
var router = express.Router();
var _ = require('lodash');
var passport = require("../config/passport");

router.get('/login', function (req, res) {
  res.render('auth/login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function (err, user, info) {
    if (err) return next(err);
    if (!user)
      return res.status(403).json({message: info.message});

    req.session.user = user._id;
    res.json({user: user.local});
  })(req, res, next);
});

router.get('/signup', function (req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function (err, user, info) {
    if (err) return next(err);
    if (!user)
      return res.status(403).json({message: info.message});

    req.session.user = user._id;
    res.json({user: user.local});
  })(req, res, next);
});

router.get('/isLogged', function(req, res, next) {
  if(req.isAuthenticated())
    res.json({user:req.user});
  else
    return res.status(400).end();
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if(err) return next(err);
    res.end();
  });
});


module.exports = router;
