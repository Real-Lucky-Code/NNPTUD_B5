var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/categories', require('./routes/categories'))

app.use('/api/v1/users', require('./routes/users'))
app.use('/api/v1/roles', require('./routes/roles'))

mongoose.connect('mongodb+srv://admin:tbt123456@cluster0.ivlinvb.mongodb.net/?appName=Cluster0');
mongoose.connection.on('connected', function () {
  console.log("connected");
})
mongoose.connection.on('disconnecting', function () {
  console.log("disconnected");
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send({
    message: err.message,
    error: err
  });
});
module.exports = app;
