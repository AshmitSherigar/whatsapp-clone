import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import { getCurrentTime, getDateLabel } from "../helpers/utils";
import { useSocket } from "../hooks/useSocket";
import { useMessageInfo } from "../hooks/useMessageInfo";
import { TiTick } from "react-icons/ti";
import { RxHamburgerMenu } from "react-icons/rx";

// Needs to update the seen ticks realtime when the chat is open also
// And also the message number in sidebar
// Needs to have loading screen and also loading bar and spinner

const Chat = () => {
  const [input, setInput] = useState("");
  const [reciever, setReciever] = useState();
  const [showTooltip, setShowTooltip] = useState(false);
  const typingTimeoutRef = useRef(null);

  const userIdRef = useRef(Math.random().toString(36).substring(2));
  const messageContainerRef = useRef(null);

  const { socketRef } = useSocket();
  const { token, user } = useAuth();
  const {
    typingInfo,
    messageArray,
    setmessageArray,
    setCurrentChatUser,
    currentChatUser,
    onlineUsers,
  } = useMessageInfo();

  const recieverRef = useRef();

  const handleRecieverFromSidebar = (value) => {
    setReciever(value);
  };

  const sendIfOpen = (data) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  useEffect(() => {
    recieverRef.current = reciever;
    setCurrentChatUser(reciever);
  }, [reciever]);

  useEffect(() => {
    if (!reciever?._id) return;

    const recieverId = reciever?._id;

    // Resets the message array every time reciever id is changed
    setmessageArray([]);

    sendIfOpen({
      type: "join",
      conversationId: [user.userId, reciever._id].sort().join("_"),
    });

    sendIfOpen({
      type: "seen",
      senderId: recieverId,
    });
  }, [reciever]);

  useEffect(() => {
    if (!reciever?._id) return;

    const recieverId = reciever?._id;
    sendIfOpen({
      type: "seen",
      senderId: recieverId,
    });

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageArray]);

  const handleKeyDown = (event) => {
    if (input.trim() == "") {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();

      const packet = {
        type: "message",
        text: input,
        // room: roomRef.current.toLowerCase(),
        recieverId: reciever._id,
      };
      sendIfOpen(packet);

      setInput("");
    }
  };

  const handleClick = (event) => {
    if (input.trim() == "") {
      return;
    }
    event.preventDefault();

    const packet = {
      type: "message",
      text: input,
      recieverId: reciever._id,
    };
    sendIfOpen(packet);
    setInput("");
  };

  const handleTyping = () => {
    if (!reciever?._id) return;
    sendIfOpen({
      type: "typing",
      recieverId: reciever._id,
    });
    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      sendIfOpen({
        type: "stop_typing",
        recieverId: reciever._id,
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    handleTyping();
  };

  useEffect(() => {
    if (!currentChatUser) {
      setmessageArray([]);
    }
  }, [currentChatUser]);

  const handleCloseChat = () => {
    setShowTooltip(false);
    setCurrentChatUser(null);
    setReciever(null);
    setmessageArray([]);
  };

  return (
    <div className="h-screen flex">
      <Sidebar sendReciever={handleRecieverFromSidebar} />
      <div className="flex flex-col w-full">
        {/* Need to change this approach and display some other feature when there is a blank chat */}
        {reciever && (
          <div
            className="flex items-center justify-between px-10 w-full h-15 bg-[#161717] text-white 
          "
          >
            <div className="flex items-center justify-center gap-5">
              {/* Reciever Username */}
              <div className=" h-10 w-10 bg-gray-300 rounded-full" />
              <div className="flex flex-col items-center justify-center ">
                <h1 className="uppercase">{reciever.username}</h1>
                {reciever && onlineUsers.includes(reciever?._id) ? (
                  <div className="flex items-start w-11 text-xs text-gray-200">
                    {typingInfo.typing &&
                    typingInfo?.whoIsTypingId === recieverRef.current?._id ? (
                      <>typing...</>
                    ) : (
                      <>online</>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div
              className={`${showTooltip ? "" : "hidden"} p-1 border border-gray-50 flex flex-col justify-between  rounded-xl z-10 absolute h-40 w-35 bg-[#252727] right-10 top-12`}
            >
              <div className="flex items-center justify-center text-white cursor-pointer">
                Option 1
              </div>
              <div className="flex items-center justify-center text-white cursor-pointer">
                Option 2
              </div>
              <div className="flex items-center justify-center text-white cursor-pointer">
                Option 3
              </div>
              <div
                onClick={handleCloseChat}
                className="flex items-center justify-center text-white cursor-pointer"
              >
                Close Chat
              </div>
            </div>
            <div onClick={() => setShowTooltip((prev) => !prev)}>
              <RxHamburgerMenu className="size-5" />
            </div>
          </div>
        )}

        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-scroll bg-[#161717f8]"
        >
          {messageArray.map((element, idx) => {
            const currentDate = getDateLabel(element.time);

            const prevDate =
              idx > 0 ? getDateLabel(messageArray[idx - 1].time) : null;

            const showDate = currentDate !== prevDate;

            return (
              <>
                {/* Display date for each group of messages */}
                {showDate && (
                  <div className="text-center text-gray-300 my-3 text-xs">
                    {currentDate}
                  </div>
                )}
                <div
                  key={idx}
                  className={`flex ${element.senderId != user.userId ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`${element.senderId != user.userId ? "" : "flex-row-reverse"} flex items-center justify-center`}
                  >
                    {/* Profile */}
                    <div className="m-1.5 flex items-center justify-center h-10 w-10 bg-gray-300 rounded-full" />
                    {/* Messages */}
                    <div
                      className={`${element.senderId != user.userId ? "bg-[#242626]" : "bg-[#144D37]"} p-2 my-0.5 rounded-lg min-w-40 max-w-150 flex flex-col text-white`}
                    >
                      {/* Text */}
                      <div className="text-sm">{element.text}</div>

                      <div className="flex items-center justify-end gap-1">
                        {/* Date */}
                        <div className="text-[10px] opacity-60 self-end mt-auto">
                          {getCurrentTime(element.time)}
                        </div>
                        {element.senderId === user.userId && (
                          <span>
                            {element.status === "seen" ? (
                              <div className="flex -space-x-3">
                                <TiTick />
                                <TiTick />
                              </div>
                            ) : (
                              <TiTick />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
        {recieverRef.current && (
          <div className="flex">
            <input
              className="w-full h-10 border rounded-sm text-white bg-[#242626]"
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Send a message"
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-green-300 rounded-sm h-10 w-20 active:scale-95"
              onClick={handleClick}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
