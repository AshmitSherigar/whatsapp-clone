require("dotenv").config();

const { WebSocketServer, WebSocket } = require("ws");
const parser = require("./src/utils/helper");
const connectDB = require("./src/db/db");
const Message = require("./src/models/message.model");

const wss = new WebSocketServer({ port: 8080 });
connectDB();

const findMessage = async (room) => {
  try {
    const foundMessage = await Message.find({ room: room }).sort({ time: 1 });

    // console.log("Saved Messages:" + foundMessage);

    return foundMessage;
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (room, finalMessage) => {
  try {
    const message = new Message({
      room: room,
      username: finalMessage.username,
      time: finalMessage.time,
      sender: finalMessage.sender,
      text: finalMessage.text,
    });
    const savedMessage = await message.save();
    // console.log(savedMessage);
  } catch (error) {
    console.error(error);
  }
};

// const messages = {};

wss.on("connection", function connection(ws) {
  console.log("Client has connected!");
  ws.on("error", console.error);
  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data);
    if (parsedData.type == "join") {
      ws.room = parsedData.room.toLowerCase();

      console.log("joining room:", ws.room);

      // Loading and sending messages if it exists
      const foundMessage = await findMessage(ws.room);

      if (foundMessage && foundMessage.length > 0) {
        foundMessage.forEach((msg) => {
          ws.send(JSON.stringify(msg));
        });
      }
    } else {
      const finalMessage = parser(
        parsedData.text,
        parsedData.sender,
        parsedData.username,
      );

      // Creating messages
      await saveMessage(ws.room, finalMessage);

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client.room == ws.room) {
          client.send(JSON.stringify(finalMessage));
        }
      });
    }
  });
});
