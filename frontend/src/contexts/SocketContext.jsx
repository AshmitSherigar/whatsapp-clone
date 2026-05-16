import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    socketRef.current = new WebSocket("ws://localhost:5000");

    socketRef.current.onopen = () => {
      console.log("Socket connected");

      socketRef.current.send(
        JSON.stringify({
          type: "auth",
          token,
        }),
      );

      setIsConnected(true);
    };

    return () => {
      socketRef.current?.close();
      setIsConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socketRef, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
