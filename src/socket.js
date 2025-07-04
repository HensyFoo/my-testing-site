// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://my-testing-site-1.onrender.com", {
  transports: ["websocket"], // 避免轮询问题
});

export default socket;
