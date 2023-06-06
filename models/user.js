const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  INCORRECT_EMAIL_ERROR_TEXT,
  INCORRECT_EMAIL_OR_PASSWORD_ERROR_TEXT,
} = require('../utils/errorMessage');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: INCORRECT_EMAIL_ERROR_TEXT,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(INCORRECT_EMAIL_OR_PASSWORD_ERROR_TEXT);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(INCORRECT_EMAIL_OR_PASSWORD_ERROR_TEXT);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
