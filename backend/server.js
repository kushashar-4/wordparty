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
    const userData = {
      clientID: socket.id,
      username: data.username,
      lives: 3,
    };

    if (allUsers.hasOwnProperty(data.room)) {
      allUsers[data.room].push(userData);
    } else {
      allUsers[data.room] = [userData];
      allUsers[data.room].splice(0, 0, { isActiveGame: false });
    }

    console.log(allUsers[data.room]);

    socket.to(data.room).emit("update_user_info", allUsers[data.room]);
    socket.emit("update_client_id", socket.id);
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
    if (allUsers[clientRoom] !== null) {
      socket.to(clientRoom).emit("update_user_info", allUsers[clientRoom]);
    }
  });

  socket.on("start_game", (data) => {
    allUsers[data.room][0].isActiveGame = true;

    socket.to(data.room).emit("update_user_info", allUsers[data.room]);
  });

  socket.on("update_life", (data) => {
    for (let i = 0; i < allUsers[data.room].length; i++) {
      if (allUsers[data.room][i].clientID == data.clientID) {
        data.isLife
          ? allUsers[data.room][i].lives++
          : allUsers[data.room][i].lives--;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("the server is running");
});
