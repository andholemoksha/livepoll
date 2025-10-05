// src/context/SocketContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import socket from "../socket";

const SocketContext = createContext(socket);

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

export const useSocket = () => useContext(SocketContext);
