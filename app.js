var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('gt-passport-http').BasicStrategy;

var routes = require('./routes');
var resources = require('./routes/resource');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.configure(function () {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(require('stylus').middleware(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

var users = {
  example: {
    username: 'example',
    password: 'password'
  }
};

passport.use(new BasicStrategy({ disableBasicChallenge: true },
  function (userid, password, done) {
    var user = users[userid];
    if (!user) {
      return done(null, false);
    }
    if (password != user.password) {
      return done(null, false);
    }
    return done(null, user);
  }
));

app.get('/', routes.index);

app.get('/api/v1/resources',
  passport.authenticate('basic', { session: false }),
  resources.list
);

module.exports = app;
