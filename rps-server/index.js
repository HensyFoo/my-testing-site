const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: {
    origin: "*", // 允许任何来源（如 Vercel）
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("player-joined");
    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on("send-name", ({ roomId, name }) => {
    socket.to(roomId).emit("receive-name", { id: socket.id, name });
  });

  socket.on("choice", ({ roomId, choice }) => {
    console.log(`${socket.id} 出拳 ${choice} in room ${roomId}`);
    socket.data.choice = choice;

    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return;

    const players = [...room].map((id) => io.sockets.sockets.get(id));

    if (players.length === 2 && players.every(p => p.data.choice)) {
      const [p1, p2] = players;
      const result = getResult(p1.data.choice, p2.data.choice);

      p1.emit("result", {
        [p1.id]: { choice: p1.data.choice, outcome: result[0] },
        [p2.id]: { choice: p2.data.choice, outcome: result[1] },
      });

      p2.emit("result", {
        [p1.id]: { choice: p1.data.choice, outcome: result[0] },
        [p2.id]: { choice: p2.data.choice, outcome: result[1] },
      });

      p1.data.choice = null;
      p2.data.choice = null;
    }
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(roomId => {
      socket.to(roomId).emit("player-left");
    });
  });
});

function getResult(c1, c2) {
  if (c1 === c2) return ["draw", "draw"];
  if (
    (c1 === "rock" && c2 === "scissors") ||
    (c1 === "paper" && c2 === "rock") ||
    (c1 === "scissors" && c2 === "paper")
  ) {
    return ["win", "lose"];
  } else {
    return ["lose", "win"];
  }
}

// ✅ 只保留一个监听器
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
