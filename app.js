require("dotenv").config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoURI = process.env.MONGO_DEV_URI;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* DB Connection */
mongoose
  .connect(mongoURI)
  .then(() => console.log(`DB connected`))
  .catch((err) => console.log(err));

app.use('/api', indexRouter);
app.use('/users', usersRouter);

module.exports = app;