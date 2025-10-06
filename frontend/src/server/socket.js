// src/socket.ts
import { io, Socket } from "socket.io-client";

const socket = io("https://livepoll-t3vr.onrender.com/", {
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});


export default socket;
