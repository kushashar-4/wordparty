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

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("get_message", data);
  });

  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data.room);
  });
});

server.listen(3000, () => {
  console.log("the server is running");
});
