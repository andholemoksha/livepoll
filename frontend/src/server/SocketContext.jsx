// src/context/SocketContext.tsx
import React, { createContext, useEffect } from "react";
import socket from "./socket";

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};