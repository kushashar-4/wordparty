const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// let totalrooms = io.sockets.adapter.rooms;
const allUsers = {};

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("get_message", data);
  });

  socket.on("join_room", (data) => {
    socket.join(data.room);
    let roomUsers = Array.from(io.sockets.adapter.rooms.get(data.room));
    const userData = {
      clientID: roomUsers[roomUsers.length - 1],
      username: data.username,
    };

    if (allUsers.hasOwnProperty(data.room)) {
      allUsers[data.room].push(userData);
    } else {
      allUsers[data.room] = [userData];
    }

    socket.to(data.room).emit("get_room_info", allUsers[data.room]);
  });
});

server.listen(3000, () => {
  console.log("the server is running");
});
