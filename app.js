const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const debug = require('debug')('express');
const indexRouter = require('./routes/index');

const app = express(); 

dotenv.config();

const PORT = process.env.PORT || 4000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d'
}));


app.use('/', indexRouter);
mongoose 
  .connect(process.env.DATABASE, {
    dbName: "ALL4ONE_CARE_SERVICE",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('MongoDB connected Successfully.')
  })
  .catch((err) => console.log(err.message))

app.listen(PORT, () => {
  debug(`Listening on port ${PORT}`);
})
module.exports = app;
