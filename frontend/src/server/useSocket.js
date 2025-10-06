import { useContext } from "react";
import { SocketContext } from "./SocketContextContext";

export const useSocket = () => useContext(SocketContext);
