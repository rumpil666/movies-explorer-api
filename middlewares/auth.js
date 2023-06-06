const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const config = require('../utils/config');

const { UNAUTHORIZED_ERROR_TEXT } = require('../utils/errorMessage');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw next(new UnauthorizedError(UNAUTHORIZED_ERROR_TEXT));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (e) {
    throw next(new UnauthorizedError(UNAUTHORIZED_ERROR_TEXT));
  }
  req.user = payload;
  next();
};
