// src/RockPaperScissors.jsx
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './RockPaperScissors.css';
import Footer from "./Footer";
import { playBackground, stopBackground, playClick, playWin, playDraw } from './sound';

const socket = io("https://my-testing-site-1.onrender.com");

const options = ["rock", "paper", "scissors"];
const emojiMap = {
  rock: "✊",
  paper: "🖐️",
  scissors: "✌️",
};

export default function RockPaperScissors({ language }) {
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
  const bgMusicRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!joined || !roomId) return;

    socket.emit("join", roomId);

    socket.on("connect", () => {
      setPlayerId(socket.id);
      socket.emit("send-name", { roomId, name: nickname });
    });

    socket.on("player-joined", () => setOpponentJoined(true));
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
        playWin();
        setScore((prev) => prev + 1);
      } else if (you.outcome === "draw") {
        playDraw();
      }
    });

    socket.on("receive-name", ({ id, name }) => {
      if (id !== socket.id) setOpponentName(name);
    });

    return () => {
      socket.off("connect");
      socket.off("player-joined");
      socket.off("player-left");
      socket.off("result");
      socket.off("receive-name");
      stopBackground(bgMusicRef.current);
    };
  }, [joined, roomId, nickname]);

  const handleClick = (choice) => {
    playClick();
    socket.emit("choice", { roomId, choice });
  };

  return (
    <div className="rps-container" style={{
    backgroundImage: "url('/Screenshot (254).png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh"
  }}>
      {!joined ? (
        <div className="rps-join-screen">
          <div className="card p-4 w-100 rps-join-card">
            <h3 className="text-center mb-4">Foo's Mini Game</h3>
            <h3 className="text-center mb-4">
              {language === "zh" ? "🎮 剪刀石头帕" : "🎮 Rock Paper Scissors"}
            </h3>
            
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="form-control mb-3"
              placeholder={language === "zh" ? "你的昵称" : "Your Nickname"}
            />
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="form-control mb-3"
              placeholder={language === "zh" ? "房间号 (例如 100)" : "Room ID (e.g. 100)"}
            />
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                if (roomInput.trim() && nameInput.trim()) {
                  setRoomId(roomInput);
                  setNickname(nameInput);
                  setJoined(true);
                  bgMusicRef.current = playBackground();
                }
              }}
            >
              {language === "zh" ? "加入房间" : "Join Room"}
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow-sm rps-game-card">
          <h4 className="text-center mb-3">
            {language === "zh" ? "房间：" : "Room:"} {roomId}
          </h4>
          <p className="text-center mb-1">
            {language === "zh" ? "你是" : "You are"} <strong>{nickname}</strong>
          </p>
          <p className="text-center">
            {language === "zh" ? "对手：" : "Opponent:"} <strong>{opponentName}</strong>
          </p>
          <p className="text-center text-success">
            {opponentJoined
              ? language === "zh" ? "✅ 对手已连接" : "✅ Opponent connected"
              : language === "zh" ? "⏳ 等待对手加入..." : "⏳ Waiting for opponent..."}
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
              <p>
                {language === "zh" ? "你出的是：" : "You chose:"} {emojiMap[playerChoice]}
              </p>
              <p>
                {language === "zh" ? "对手出的是：" : "Opponent chose:"} {emojiMap[opponentChoice]}
              </p>
              <h5 className="mt-3">
                {outcome === "win"
                  ? language === "zh" ? "🎉 你赢了！" : "🎉 You win!"
                  : outcome === "lose"
                    ? language === "zh" ? "😭 你输了！" : "😭 You lose!"
                    : language === "zh" ? "🤝 平手！" : "🤝 Draw!"}
              </h5>
            </div>
          )}

          <div className="alert alert-info text-center mt-4">
            🏆 {language === "zh" ? "当前胜场" : "Current Wins"} : {score}
          </div>

          <div className="text-center">
            <button className="btn btn-outline-danger" onClick={() => navigate("/")}>🏠 {language === "zh" ? "返回首页" : "Back to Home"}</button>
          </div>
          <br />

          <Footer />
        </div>

        
      )}
      
    </div>
  );
}
