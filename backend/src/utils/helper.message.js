const Message = require("../models/message.model");

const findMessage = async (conversationId) => {
  try {
    const foundMessage = await Message.find({ conversationId }).sort({
      time: 1,
    });

    return foundMessage;
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (conversationId, finalMessage) => {
  try {
    const message = new Message({
      conversationId,
      username: finalMessage.username,
      time: finalMessage.time,
      senderId: finalMessage.senderId,
      recieverId: finalMessage.recieverId,
      text: finalMessage.text,
      status: finalMessage.status,
    });
    await message.save();
    return message;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { saveMessage, findMessage };
