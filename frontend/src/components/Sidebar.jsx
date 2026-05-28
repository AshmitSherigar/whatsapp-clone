import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessageInfo } from "../hooks/useMessageInfo";
import { formatMessage, getCurrentDate } from "../helpers/utils";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

const Sidebar = ({ sendReciever }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTooltip, setShowToolTip] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [lastMessage, setLastMessage] = useState([]);

  const { user, logout, token } = useAuth();
  const { messageArray, typingInfo } = useMessageInfo();

  console.log(messageArray);

  const handleToolTipClick = () => {
    setShowToolTip(!showTooltip);
  };

  // removes the current user to display
  const filteredUsers = allUsers.filter((allUser, index) => {
    return allUser.username !== user.username;
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/message/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/message/conversations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLastMessage(data);
      });
  }, [user, messageArray]);

  const handleClick = (user) => {
    setSelectedUser(user);
    sendReciever(user);
  };
  const handleInput = (e) => {
    setSearchUser(e.target.value);
  };

  return (
    <div className="w-130 bg-[#161717]  border-r border-l border-gray-600">
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-white text-3xl">Whatsapp</div>
        <div
          className={`${showTooltip ? "" : "hidden"} p-1 border border-gray-50 flex flex-col justify-between  rounded-xl z-10 absolute h-40 w-35 bg-[#252727] left-55 top-15`}
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
            onClick={() => logout()}
            className="flex items-center justify-center text-white cursor-pointer hover:bg-[#343636]"
          >
            Logout
          </div>
        </div>
        <RxCross2
          onClick={handleToolTipClick}
          className={`text-white size-7 rounded-full hover:bg-[#353636] ${showTooltip ? "rotate-45" : "rotate-0"}`}
        />
      </div>
      <div>
        <input
          type="text"
          value={searchUser}
          placeholder="Search User"
          onChange={handleInput}
          className="w-full h-10 border rounded-2xl text-white bg-[#2E2F2F] px-5"
        />
      </div>
      {filteredUsers.map((filteredUser) => {
        // for each filtered user this checks the last message and finds the first message with their id in sender or reciever

        const message = lastMessage.find((msg) => {
          return (
            msg.senderId === filteredUser._id ||
            msg.recieverId === filteredUser._id
          );
        });
        const isMessageMine = message?.recieverId === filteredUser?._id;

        console.log(message?.status);

        return (
          <div
            key={filteredUser._id}
            className={`${
              filteredUser === selectedUser ? "bg-[#3a3e3e]" : "bg-[#242626]"
            } m-2 text-white flex items-center justify-between gap-1 px-5 h-20 rounded-xl hover:bg-[#3a3e3e]`}
            onClick={() => handleClick(filteredUser)}
          >
            <div className="flex gap-3">
              <div className="flex items-center justify-center h-10 w-10 bg-gray-300 rounded-full" />
              <div className="text-white flex flex-col">
                <div className="capitalize text-xl">
                  {filteredUser.username}
                </div>
                <p className="text-sm">
                  {typingInfo?.typing &&
                  typingInfo?.whoIsTypingId === filteredUser._id ? (
                    <span className="text-green-500">typing...</span>
                  ) : message ? (
                    isMessageMine ? (
                      <span className="flex items-center">
                        {message?.status === "seen" ? (
                          <div className="flex -space-x-2.5">
                            <TiTick />
                            <TiTick />
                          </div>
                        ) : (
                          <TiTick />
                        )}{" "}
                        {formatMessage(message.text)}
                      </span>
                    ) : (
                      <span>{formatMessage(message.text)}</span>
                    )
                  ) : null}
                </p>
              </div>
            </div>
            {/* Need to fix the invalid date option for first time chat */}
            {message?.text ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-[10px] ">
                  {getCurrentDate(message?.time)}
                </div>
                <div className=" h-5 w-5 bg-green-500 rounded-full border border-black">
                  <p className="text-xs flex items-center justify-center">1</p>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
