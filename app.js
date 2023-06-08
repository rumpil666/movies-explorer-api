require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const config = require('./utils/config');
const limiter = require('./middlewares/rateLimite');

const app = express();

app.use(cors);

mongoose.connect(config.MONGODB_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(config.PORT);
