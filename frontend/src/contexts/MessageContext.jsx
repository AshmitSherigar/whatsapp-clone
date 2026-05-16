import { createContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messageArray, setmessageArray] = useState([]);
  const [typing, setTyping] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState(null);

  const { socketRef, isConnected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!isConnected) return;
    const socket = socketRef.current;

    if (!socket) {
      console.log("Socket not available yet");
      return;
    }
    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      const recieverId = currentChatUser?._id;

      switch (incomingMessage.type) {
        case "online_users":
          setOnlineUsers(incomingMessage.users);
          break;

        case "typing":
          setTyping(true);
          break;

        case "stop_typing":
          setTyping(false);
          break;

        case "seen_update":
          setmessageArray((prev) =>
            prev.map((msg) =>
              msg.senderId == user.userId ? { ...msg, status: "seen" } : msg,
            ),
          );
          break;

        default:
          setmessageArray((prev) => [...prev, incomingMessage]);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [isConnected]);

  return (
    <MessageContext.Provider
      value={{
        typing,
        onlineUsers,
        messageArray,
        setmessageArray,
        currentChatUser,
        setCurrentChatUser,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
