const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequestError = require('../errors/BadRequestError');
const { INCORRECT_URL_ERROR_TEXT } = require('../utils/errorMessage');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequestError(INCORRECT_URL_ERROR_TEXT);
};

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validationMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationUrl),
    trailerLink: Joi.string().required().custom(validationUrl),
    thumbnail: Joi.string().required().custom(validationUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationUserInfo,
  validationMovie,
  validationMovieId,
};
