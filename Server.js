require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbConnect = require('./utils/db');
const authRouter = require('./routers/auth-router');
const Message = require('./models/Message'); 

const app = express();

app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
});

let users = {};

io.on('connection', (socket) => {
  const senderEmail = socket.handshake.query.email || 'Anonymous';
  const senderName = socket.handshake.query.name || 'Anonymous';
  
  console.log('User connected:', socket.id, senderEmail);
  
  users[socket.id] = { id: socket.id, email: senderEmail,names:senderName };
  
  io.emit('userList', Object.values(users));

  socket.on('sendPrivateMessage', async ({ message, recipientId, recipientEmail, senderEmail,senderName,Date }) => {
    console.log(`Message from ${senderEmail} to ${recipientEmail}`);
    
    await Message.create({ message, recipientEmail, senderEmail,name:senderName ,Date});
    
    io.to(recipientId).emit('receiveChatMessage', { message, id: socket.id, recipientEmail, senderEmail, name:senderName,Date});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    delete users[socket.id];
    
    io.emit('userList', Object.values(users));
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
