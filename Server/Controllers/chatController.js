const asyncHandler = require('express-async-handler');
const User = require('../models/usermodel');
const Chat = require('../models/chatmodel');
const Message = require('../models/messagemodel');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latesMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const deletechat = asyncHandler(async (req, res) => {
  await Message.deleteMany({ chat: req.params.id });
  await Chat.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Done' });
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name email',
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchGroups = asyncHandler(async (req, res) => {
  try {
    const allGroups = await Chat.where('isGroupChat').equals(true);
    res.status(200).send(allGroups);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Data is insufficient' });
  }

  var users = JSON.parse(req.body.users);
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const groupExit = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed);
  }
});

const addSelfToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Check if the user is already in the group
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({ error: 'Chat Not Found' });
  }

  if (chat.users.includes(userId)) {
    return res.status(400).json({ error: 'User is already in the group' });
  }

  // If the user is not in the group, add them
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage'); // Populate the latestMessage field

  if (!added) throw new Error('Chat Not Found');
  else res.json(added);
});

const getchat = asyncHandler(async (req, res) => {
  const response = await Chat.findById(req.params.id)
    .populate('users')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        model: 'User',
      },
    })
    .sort({ 'latestMessage.createdAt': -1 });

  res.json(response);
});

// Searchbar

const getsearchedgroup = asyncHandler(async (req, res) => {
  const { searchfor } = req.query;

  const query = {
    isGroupChat: true,
    chatName: { $regex: searchfor, $options: 'i' },
  };

  try {
    const users = await Chat.find(query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error searching for users' });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfToGroup,
  getchat,
  deletechat,
  getsearchedgroup,
};
