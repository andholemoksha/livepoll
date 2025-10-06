// src/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.SOCKET_URL ||"https://livepoll-n1df.onrender.com"|| "http://localhost:3000"; // your backend server

// Create a singleton socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false, // manually control when to connect
});

export default socket;
