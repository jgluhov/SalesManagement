var User = require("../models/user").User;

module.exports = function (req, res, next) {
  User.findById(req.session.user, function (err, user) {
    if (err) return next(err);
    req.user = user;
    next();
  })
};
