const express = require('express');
const {
  loginController,
  registerController,
  fetchAllUsersController,
  getuser,
  getsearcheduser,
} = require('../Controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const Router = express.Router();

Router.post('/login', loginController);
Router.post('/register', registerController);
Router.get('/fetchUsers', protect, fetchAllUsersController);
Router.get('/getuser/:id', protect, getuser);
Router.get('/getsearcheduser', protect, getsearcheduser);

module.exports = Router;
