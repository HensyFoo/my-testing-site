// ✅ 引入模块
const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// ✅ 初始化 Socket.IO
const io = new Server(http, {
  cors: {
    origin: "*", // 允许任何来源，部署时可改成你的前端网址
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// ✅ 测试路由
app.get("/", (req, res) => {
  res.send("✅ Socket.IO server is running.");
});

// ✅ Socket 逻辑
io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // ✅ 玩家加入房间逻辑
 socket.on("join", async (roomId) => {
  socket.join(roomId);

  // 🔁 等待 Socket 真正加入房间
  await new Promise((resolve) => setTimeout(resolve, 50));

  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return;
  const clients = [...room];

  if (clients.length === 1) {
    socket.emit("player-symbol", "X");
  } else if (clients.length === 2) {
    socket.emit("player-symbol", "O");
    socket.to(roomId).emit("player-joined");
  }

  console.log(`${socket.id} joined room ${roomId}`);
});


  // ✅ 昵称同步
  socket.on("send-name", ({ roomId, name }) => {
    socket.to(roomId).emit("receive-name", { id: socket.id, name });
  });

  // ✅ 剪刀石头布逻辑
  socket.on("choice", ({ roomId, choice }) => {
    console.log(`${socket.id} 出拳 ${choice} in room ${roomId}`);
    socket.data.choice = choice;

    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room) return;

    const players = [...room].map((id) => io.sockets.sockets.get(id));

    if (players.length === 2 && players.every(p => p.data.choice)) {
      const [p1, p2] = players;
      const result = getRPSResult(p1.data.choice, p2.data.choice);

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

  // ✅ 井字棋同步
  socket.on("move", ({ roomId, squares, currentTurn }) => {
    console.log("📦 move received:", roomId, squares, currentTurn); // ✅ 加这一行
    console.log(`🎮 move in ${roomId} by ${socket.id}:`, squares);
    io.to(roomId).emit("update-board", { squares, currentTurn });
  });

  socket.on("reset", (roomId) => {
    console.log(`🔄 reset board in ${roomId}`);
    io.to(roomId).emit("reset-board");
  });

  // ✅ 玩家断线
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms].filter((r) => r !== socket.id);
    rooms.forEach(roomId => {
      socket.to(roomId).emit("player-left");
      console.log(`❌ ${socket.id} left room ${roomId}`);
    });
  });
});

// ✅ 剪刀石头布判断函数
function getRPSResult(c1, c2) {
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

// ✅ 启动服务器
const PORT = process.env.PORT || 10000;
http.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
