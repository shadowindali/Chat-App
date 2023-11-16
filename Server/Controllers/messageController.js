const asyncHandler = require('express-async-handler');
const User = require('../models/usermodel');
const Message = require('../models/messagemodel');
const Chat = require('../models/chatmodel');

const allMessages = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email')
      .populate('chat');
    res.json(message);
  } catch (error) {
    res.json({ err: 'error' });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log('message control error');
    return res.status(400);
  }

  var newmessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newmessage);

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    throw Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
