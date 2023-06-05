const userRouter = require('express').Router();
const {
  getUsers,
  updateUser,
} = require('../controllers/users');

const {
  validationUserInfo,
} = require('../middlewares/validations');

userRouter.get('/', getUsers);
userRouter.patch('/me', validationUserInfo, updateUser);

module.exports = userRouter;
