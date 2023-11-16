const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

// SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
  allowEIO3: true,
});

io.on('connection', (socket) => {
  socket.on('join room', (data) => {
    socket.join(data.room);
  });

  socket.on('leave', (data) => {
    socket.leave(data.room);
  });

  socket.on('send message', (data) => {
    socket.to(data.room).emit('receive message', { ...data });
  });
});

app.use(express.json());

// DATABASE //
// const MongoURL = 'mongodb://127.0.0.1:27017/ChatApp';
const MongoURL = "mongodb+srv://alialimonzer10:Ali_monzer10@shadowindali.rfeldlw.mongodb.net/Chatapp";

mongoose.connect(MongoURL).then(() => console.log('connected'));

// END OF DATABASE //

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

const PORT = 3000;
server.listen(PORT);
// app.listen(PORT, console.log("Server is Running..."));
