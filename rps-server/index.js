// rps-server/index.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 开发时允许所有来源
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // 每个房间两个玩家 + 选择

/*
io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { choice: null };
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // 通知房间里其他人
    socket.to(roomId).emit("player-joined", socket.id);
  });

  socket.on("choice", ({ roomId, choice }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      rooms[roomId][socket.id].choice = choice;

      const players = Object.entries(rooms[roomId]);
      if (players.length === 2) {
        const [p1Id, p1Data] = players[0];
        const [p2Id, p2Data] = players[1];

        if (p1Data.choice && p2Data.choice) {
          const result = getResult(p1Data.choice, p2Data.choice);
          io.to(roomId).emit("result", {
            [p1Id]: { choice: p1Data.choice, outcome: result[0] },
            [p2Id]: { choice: p2Data.choice, outcome: result[1] },
          });

          // 清空选择准备下一轮
          rooms[roomId][p1Id].choice = null;
          rooms[roomId][p2Id].choice = null;
        }
      }
    }
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        socket.to(roomId).emit("player-left", socket.id);
      }
      if (Object.keys(rooms[roomId]).length === 0) delete rooms[roomId];
    }
    console.log("Disconnected: " + socket.id);
  });
});*/


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 玩家加入房间
  socket.on("join", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("player-joined");
    console.log(`${socket.id} joined room ${roomId}`);
  });

  // ✅ 玩家送出名字给对方
  socket.on("send-name", ({ roomId, name }) => {
    socket.to(roomId).emit("receive-name", { id: socket.id, name });
  });

  // 玩家送出出拳
  socket.on("choice", ({ roomId, choice }) => {
    // ...略
  });

  // 玩家断开
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(roomId => {
      socket.to(roomId).emit("player-left");
    });
  });

});


function getResult(p1, p2) {
  if (p1 === p2) return ["draw", "draw"];
  if (
    (p1 === "rock" && p2 === "scissors") ||
    (p1 === "scissors" && p2 === "paper") ||
    (p1 === "paper" && p2 === "rock")
  ) {
    return ["win", "lose"];
  }
  return ["lose", "win"];
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
