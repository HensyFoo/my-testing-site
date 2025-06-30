import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 用于设定背景图样式

const socket = io("https://my-testing-site-1.onrender.com");

const options = ["rock", "paper", "scissors"];
const emojiMap = {
  rock: "✊",
  paper: "🖐️",
  scissors: "✌️",
};

export default function RockPaperScissors() {
  const [joined, setJoined] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nickname, setNickname] = useState("");
  const [opponentName, setOpponentName] = useState("(等待中)");
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [score, setScore] = useState(0);

 /* useEffect(() => {
    if (!joined || !roomId) return;
    socket.emit("join", roomId);
    setPlayerId(socket.id);
    socket.emit("send-name", { roomId, name: nickname });

    socket.on("player-joined", () => {
      setOpponentJoined(true);
    });

    socket.on("player-left", () => {
      setOpponentJoined(false);
      setOpponentName("(等待中)");
    });

    socket.on("result", (data) => {
      const you = data[socket.id];
      const opponent = Object.entries(data).find(([id]) => id !== socket.id);
      setPlayerChoice(you.choice);
      setOpponentChoice(opponent[1].choice);
      setOutcome(you.outcome);
      if (you.outcome === "win") {
        setScore((prev) => prev + 1);
      }
    });

    socket.on("receive-name", ({ id, name }) => {
      if (id !== socket.id) {
        setOpponentName(name);
      }
    });

    return () => {
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("result");
      socket.off("receive-name");
    };
  }, [joined, roomId, nickname]); */

  useEffect(() => {
  if (!joined || !roomId) return;

  socket.emit("join", roomId);

  socket.on("connect", () => {
    setPlayerId(socket.id);
    socket.emit("send-name", { roomId, name: nickname });
  });

  socket.on("player-joined", () => {
    setOpponentJoined(true);
  });

  socket.on("player-left", () => {
    setOpponentJoined(false);
    setOpponentName("(等待中)");
  });

  socket.on("result", (data) => {
    const you = data[socket.id];
    const opponent = Object.entries(data).find(([id]) => id !== socket.id);
    setPlayerChoice(you.choice);
    setOpponentChoice(opponent[1].choice);
    setOutcome(you.outcome);
    if (you.outcome === "win") {
      setScore((prev) => prev + 1);
    }
  });

  socket.on("receive-name", ({ id, name }) => {
    if (id !== socket.id) {
      setOpponentName(name);
    }
  });

  return () => {
    socket.off("connect");
    socket.off("player-joined");
    socket.off("player-left");
    socket.off("result");
    socket.off("receive-name");
  };
}, [joined, roomId, nickname]);


  const handleClick = (choice) => {
    socket.emit("choice", { roomId, choice });
  };

  if (!joined) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-image">
        <div className="card p-4 w-100" style={{ maxWidth: "400px", backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h3 className="text-center mb-4">Foo's mini game</h3>
          <h3 className="text-center mb-4">🎮 剪刀石头布</h3>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="form-control mb-3"
            placeholder="你的昵称"
          />
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            className="form-control mb-3"
            placeholder="房间号 (例如 100)"
          />
          <button
            className="btn btn-primary w-100"
            onClick={() => {
              if (roomInput.trim() && nameInput.trim()) {
                setRoomId(roomInput);
                setNickname(nameInput);
                setJoined(true);
              }
            }}
          >
            加入房间
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5"
    style={{
    backgroundImage: "url('/Screenshot (254).png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  }}
    >
      <div className="card p-4 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
        <h4 className="text-center mb-3">房间：{roomId}</h4>
        <p className="text-center mb-1">你是 <strong>{nickname}</strong></p>
        <p className="text-center">对手：<strong>{opponentName}</strong></p>
        <p className="text-center text-success">
          {opponentJoined ? "✅ 对手已连接" : "⌛ 等待对手加入..."}
        </p>

        <div className="d-flex justify-content-center gap-3 my-4">
          {options.map((opt) => (
            <button
              key={opt}
              className="btn btn-outline-dark btn-lg"
              onClick={() => handleClick(opt)}
            >
              {emojiMap[opt]}
            </button>
          ))}
        </div>

        {outcome && (
          <div className="text-center mb-3">
            <p>你出的是：{emojiMap[playerChoice]}</p>
            <p>对手出的是：{emojiMap[opponentChoice]}</p>
            <h5 className="mt-3">
              {outcome === "win" ? "🎉 你赢了！" : outcome === "lose" ? "😭 你输了！" : "🤝 平手！"}
            </h5>
          </div>
        )}

        <div className="alert alert-info text-center mt-4">
          🏆 当前胜场：{score}
        </div>
      </div>
    </div>
  );
}
