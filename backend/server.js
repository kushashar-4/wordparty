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
  socket.on("join_room", (data) => {
    socket.join(data.room);

    let roomUsers = Array.from(io.sockets.adapter.rooms.get(data.room));
    const userData = {
      clientID: roomUsers[roomUsers.length - 1],
      username: data.username,
      points: 0,
    };

    if (allUsers.hasOwnProperty(data.room)) {
      allUsers[data.room].push(userData);
    } else {
      allUsers[data.room] = [userData];
    }

    console.log(allUsers);

    socket.to(data.room).emit("update_user_info", allUsers[data.room]);
  });

  socket.on("disconnecting", (reason) => {
    let infoArray = Array.from(socket.rooms);
    let clientID = infoArray[0];
    let clientRoom = infoArray[1];
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        if (allUsers[clientRoom].length == 1) {
          delete allUsers[clientRoom];
        } else {
          for (let i = 0; i < allUsers[clientRoom].length; i++) {
            if (allUsers[clientRoom][i].clientID == clientID) {
              allUsers[clientRoom].splice(i, 1);
            }
          }
        }
      }
    }
    console.log(allUsers);
    if (allUsers[clientRoom] !== null) {
      socket.to(clientRoom).emit("update_user_info", allUsers[clientRoom]);
    }
  });

  socket.on("update_points", (data) => {
    let clientID = Array.from(socket.rooms)[0];
    let clientRoom = data.room;
    for (let i = 0; i < allUsers[clientRoom].length; i++) {
      if (allUsers[clientRoom][i].clientID == clientID) {
        console.log(allUsers[clientRoom][i]);
      }
    }

    socket.to(clientRoom).emit("update_user_info", allUsers[clientRoom]);
  });
});

server.listen(3000, () => {
  console.log("the server is running");
});
