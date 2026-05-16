const Message = require("../models/message.model");
const User = require("../models/user.model");

const getUserController = async (req, res) => {
  try {
    const users = await User.find({}, "_id username");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
const getMessageController = async (req, res) => {
  const userId = req.userId;

  const messages = await Message.find({
    $or: [{ senderId: userId }, { recieverId: userId }],
  }).sort({ time: -1 });

  const map = new Map();
  messages.forEach((msg) => {
    const otherUser = msg.senderId === userId ? msg.recieverId : msg.senderId;
    if (!map.has(otherUser)) {
      map.set(otherUser, msg);
    }
  });

  const result = Array.from(map.values());
  res.json(result);
};
module.exports = { getUserController, getMessageController };
