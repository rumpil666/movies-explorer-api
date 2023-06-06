const movieRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationMovie,
  validationMovieId,
} = require('../middlewares/validations');

movieRouter.get('/', getMovies);

movieRouter.post('/', validationMovie, createMovie);

movieRouter.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = movieRouter;
