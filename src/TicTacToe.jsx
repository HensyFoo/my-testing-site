// src/TicTacToe.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./TicTacToe.css";
import Footer from "./Footer";

// ✅ 创建 socket 实例，只创建一次（单例）
const socket = io("https://my-testing-site-1.onrender.com");

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe({ language }) {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [nickname, setNickname] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [opponentName, setOpponentName] = useState("(等待中)");

  const navigate = useNavigate();

  // ✅ 房间加入和监听
  useEffect(() => {
    if (!joined) return;

    console.log("📥 useEffect triggered. joined =", joined);
    console.log("🚪 Emitting join for room:", roomId);

    socket.emit("join", roomId);

    // ✅ 发送昵称（不用放在 on connect）
    socket.emit("send-name", { roomId, name: nickname });

    socket.on("player-symbol", (symbol) => {
      console.log("🎯 You are assigned:", symbol);
      console.log("🎯 Received player symbol:", symbol);  // 加这个
      setPlayerSymbol(symbol);
    });

    socket.on("receive-name", ({ id, name }) => {
      if (id !== socket.id) {
        console.log("📨 Received opponent name:", name);
        setOpponentName(name);
      }
    });

    socket.on("update-board", ({ squares, currentTurn }) => {
      console.log("🎯 update-board received"); 
      console.log("🧩 Board update received:", squares);
      setSquares(squares);
      setCurrentTurn(currentTurn);
      const win = calculateWinner(squares);
      setWinner(win);
    });

    socket.on("reset-board", () => {
      setSquares(Array(9).fill(null));
      setCurrentTurn("X");
      setWinner(null);
    });

    return () => {
      socket.off("player-symbol");
      socket.off("receive-name");
      socket.off("update-board");
      socket.off("reset-board");
    };
  }, [joined, roomId, nickname]);

  // ✅ 玩家点击格子
  const handleClick = (index) => {
    if (squares[index] || winner || currentTurn !== playerSymbol) return;

    const newSquares = squares.slice();
    newSquares[index] = playerSymbol;
    const newTurn = playerSymbol === "X" ? "O" : "X";

    console.log("🟢 Sending move:", newSquares);
    socket.emit("move", { roomId, squares: newSquares, currentTurn: newTurn });
  };

  const handleReset = () => {
    socket.emit("reset", roomId);
  };

  return (
    <div className="ttt-container">
      {!joined ? (
        <div className="ttt-join-screen">
          <div className="card p-4 w-100 ttt-join-card">
            <h3 className="text-center mb-4">Tic Tac Toe Online</h3>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="form-control mb-3"
              placeholder="Your Nickname"
            />
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="form-control mb-3"
              placeholder="Room ID"
            />
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                if (roomInput.trim() && nameInput.trim()) {
                  setRoomId(roomInput.trim());
                  setNickname(nameInput.trim());
                  setJoined(true);
                }
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4 ttt-game-card">
          <h4 className="text-center mb-3">Room: {roomId}</h4>
          <p className="text-center">
            You: <strong>{nickname}</strong> ({playerSymbol || "..."})
          </p>
          <p className="text-center">
            Opponent: <strong>{opponentName}</strong>
          </p>
          <p className="text-center text-info">
            {winner ? `🏆 Winner: ${winner}` : `👉 Turn: ${currentTurn}`}
          </p>

          <div className="ttt-board">
            {squares.map((value, index) => (
              <button
                key={index}
                className="ttt-square"
                onClick={() => handleClick(index)}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="text-center mt-3">
            <button className="btn btn-warning me-2" onClick={handleReset}>
              🔄 Reset
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/")}
            >
              🏠 Back
            </button>
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}

// ✅ 判断胜利函数
function calculateWinner(squares) {
  for (let [a, b, c] of WINNING_COMBINATIONS) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
