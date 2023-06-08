const userRouter = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const {
  validationUserInfo,
} = require('../middlewares/validations');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', validationUserInfo, updateUser);

module.exports = userRouter;
