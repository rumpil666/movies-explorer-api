const httpConstants = require('http2').constants;
const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort({ createdAt: -1 })
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => Movie.populate(movie, ['owner'])
      .then((populateMovie) => res.status(httpConstants.HTTP_STATUS_CREATED).send(populateMovie)))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .populate(['owner'])
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такого фильма не существует');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => res.status(200).send(deletedMovie))
          .catch(next);
      }
    })
    .catch(next);
};
