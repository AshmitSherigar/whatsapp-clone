import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessageInfo } from "../hooks/useMessageInfo";

const Sidebar = ({ sendReciever }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [showTooltip, setShowToolTip] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [lastMessage, setLastMessage] = useState([]);

  const { user, logout } = useAuth();
  const { onlineUsers } = useMessageInfo();

  const handleToolTipClick = () => {
    setShowToolTip(!showTooltip);
    // logout();
  };

  const filteredUsers = allUsers.filter((allUser, index) => {
    return allUser.username !== user.username;
  });

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setAllUsers(data));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/conversations/${user.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setLastMessage(data);
      });
  }, [user]);

  const handleClick = (user) => {
    setSelectedUser(user);
    sendReciever(user);
  };
  const handleInput = (e) => {
    setSearchUser(e.target.value);
  };

  const getCurrentDate = (time) => {
    const messageDate = new Date(time);

    const today = new Date();

    const isToday = messageDate.toDateString() === today.toDateString();

    if (isToday) {
      const hours = String(messageDate.getHours()).padStart(2, "0");
      const minutes = String(messageDate.getMinutes()).padStart(2, "0");
      const timeString = `${hours}:${minutes}`;
      return timeString;
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isYesterday) return "Yesterday";

    return messageDate.toLocaleDateString();
  };

  const formatMessage = (message) => {
    if (message.length < 22) return message;
    else return message.slice(0, 22) + "...";
  };
  return (
    <div className="w-100 bg-[#161717]  border-r border-l border-gray-600">
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          onClick={handleToolTipClick}
          className={`size-7 rounded-full hover:bg-[#353636] ${showTooltip ? "rotate-45" : "rotate-0"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
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
        const isOnline = onlineUsers?.includes(filteredUser._id);

        // for each filtered user this checks the last message and finds the first message with their id in sender or reciever

        const message = lastMessage.find((msg) => {
          return (
            msg.senderId === filteredUser._id ||
            msg.recieverId === filteredUser._id
          );
        });

        return (
          <div
            key={filteredUser._id}
            className={`${
              filteredUser === selectedUser ? "bg-[#3a3e3e]" : "bg-[#242626]"
            } w-full border border-white text-white flex items-center justify-between gap-1 px-5 h-20 rounded-sm`}
            onClick={() => handleClick(filteredUser)}
          >
            <div className="">
              <div className="flex items-center justify-center h-8   w-8   bg-gray-300 rounded-full" />

              <div className="capitalize">{filteredUser.username}</div>
            </div>
            <div className="text-sm opacity-70 text-white">
              {message ? formatMessage(message.text) : ""}
            </div>
            <div className="text-[10px] ">{getCurrentDate(message?.time)}</div>
            {isOnline && (
              <div className=" h-2 w-2 bg-green-500 rounded-full border border-black" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
