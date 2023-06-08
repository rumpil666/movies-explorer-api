const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { validationLogin, validationCreateUser } = require('../middlewares/validations');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_PAGE_ERROR_TEXT } = require('../utils/errorMessage');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR_TEXT));
});

module.exports = router;
