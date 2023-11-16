const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const UserModel = require('../models/usermodel');
const generateToken = require('../Config/generateToken');

// LOGIN FUNCTION //
const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await UserModel.findOne({ name });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    throw new Error('Invalid username or password');
  }
});

// REGISTER FUNCTION //
const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Checking For Fields //
  if (!name || !email || !password) {
    res.send(400);
    throw Error('Wrong in input fields');
  }

  //pre-existing users //
  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.status(405);
    throw new Error('User Already Exist');
  }

  // userName is taken
  const usernameExist = await UserModel.findOne({ name });
  if (usernameExist) {
    res.status(406);
    throw new Error('Username Already Exist');
  }

  //create entry in DB
  const user = await UserModel.create({ name, email, password });
  if (user)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  else {
    res.status(400);
    throw new Error('Registeration failed');
  }
});

// FETCH USERS
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

//Get user info
const getuser = expressAsyncHandler(async (req, res) => {
  const response = await UserModel.findById(req.body.id);
  res.json({ response });
});

// Searchbar
const getsearcheduser = expressAsyncHandler(async (req, res) => {
  const { searchfor } = req.query;

  const query = {
    $and: [
      {
        $or: [
          { name: { $regex: searchfor, $options: 'i' } },
          { email: { $regex: searchfor, $options: 'i' } },
        ],
      },
      { _id: { $ne: req.user._id } },
    ],
  };

  try {
    const users = await UserModel.find(query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error searching for users' });
  }
});

module.exports = {
  loginController,
  registerController,
  fetchAllUsersController,
  getuser,
  getsearcheduser,
};
