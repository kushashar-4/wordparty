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

const allUsers = {};
const roomTimers = {}; // key : room, value : timeoutID


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
        delete allUsers[clientRoom];
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

  socket.on("advance_game_server", (data) => {
    let currentIndex = data.activeUserIndex;
    let isCorrect = data.isCorrect;

    const advanceUser = (isCorrect) => {

      // Update lives
      if(allUsers[data.room]) {
        if(!isCorrect) {
          for (let i = 0; i < allUsers[data.room].length; i++) {
            if(i == currentIndex) {
              allUsers[data.room][i].lives--;
            }
          }
        }
    
        socket.to(data.room).emit("update_user_info", allUsers[data.room]);
      
        // Update active user index
        const userCount = data.len - 1;
        currentIndex = currentIndex + 1 > userCount ? 1 : currentIndex + 1;
  
        socket.to(data.room).emit("update_active_user_index", currentIndex);
  
        // Send new combo
        const newCombo = data.comboList[Math.floor(Math.random() * data.comboList.length)][0];
        socket.to(data.room).emit("update_combo", newCombo);
  
        if(isCorrect) {
          clearTimeout(roomTimers[data.room]);
        }
  
        roomTimers[data.room] = setTimeout(() => advanceUser(false), 10000)
      }
    }

    advanceUser(isCorrect)
  })
});

server.listen(3000, () => {
  console.log("the server is running");
});
