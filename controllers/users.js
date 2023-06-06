const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpConstants = require('http2').constants;
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const config = require('../utils/config');

const {
  DUPLICATE_EMAIL_ERROR_TEXT,
  NOT_FOUND_USER_ERROR_TEXT,
} = require('../utils/errorMessage');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NOT_FOUND_USER_ERROR_TEXT);
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name: user.name,
      email,
    }))
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError(DUPLICATE_EMAIL_ERROR_TEXT));
      } else {
        next(e);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(NOT_FOUND_USER_ERROR_TEXT));
      } else {
        res.send(user);
      }
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError(DUPLICATE_EMAIL_ERROR_TEXT));
      } else {
        next(e);
      }
    });
};
