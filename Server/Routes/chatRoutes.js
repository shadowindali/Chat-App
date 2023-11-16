const express = require('express');

const {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfToGroup,
  getchat,
  deletechat,
  getsearchedgroup,
} = require('../Controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const Router = express.Router();

Router.route('/').post(protect, accessChat);
Router.route('/').get(protect, fetchChats);
Router.route('/createGroup').post(protect, createGroupChat);
Router.route('/fetchGroups').get(protect, fetchGroups);
Router.route('/addSelfToGroup').put(protect, addSelfToGroup);
Router.route('/groupExit').put(protect, groupExit);
Router.route('/searchgroup').get(protect, getsearchedgroup);

Router.route('/:id').get(protect, getchat);
Router.route('/:id').delete(protect, deletechat);

module.exports = Router;
