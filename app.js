var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var breadcrumbs = require('express-breadcrumbs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('./config/passport');

var config = require('./config');
var routes = require('./routes');
var admin = require('./routes/admin');
var shop = require('./routes/shop');
var auth = require('./routes/auth');

var app = express();

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// require('./config/passport')(passport); // pass passport for configuration

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
  secret: config.get('session:secret'),
  resave: false,
  saveUninitialized: true,
  cookie: config.get('session:cookie'),
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(require('./middleware/user'));
app.use(passport.initialize());
app.use(passport.session());

app.use(breadcrumbs.init());
app.use(breadcrumbs.setHome());
app.use('/admin', breadcrumbs.setHome({
  name: 'Dashboard',
  url: '/admin'
}));

app.use('/', routes);
app.use('/admin', admin);
app.use('/shop', shop);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error', {
    message: err.message,
    error: err
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
