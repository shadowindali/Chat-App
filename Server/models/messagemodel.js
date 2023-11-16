const mongoose = require('mongoose');

const messageModel = mongoose.Schema(
  {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
);

messageModel.pre('save', async function (next) {
  await this.populate('sender chat');
  next();
});

messageModel.pre(/^find/, function (next) {
  this.populate('sender chat');
  next();
});

const Message = mongoose.model('Message', messageModel);
module.exports = Message;
