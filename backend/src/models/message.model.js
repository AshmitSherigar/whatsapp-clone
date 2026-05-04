const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: { type: String },
  senderId: { type: String },
  recieverId: { type: String },
  text: { type: String },
  username: { type: String },
  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
  time: { type: Date },
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
