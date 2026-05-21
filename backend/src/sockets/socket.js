const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");
const parser = require("../utils/helper.parser");
const { findMessage, saveMessage } = require("../utils/helper.message");
const Message = require("../models/message.model");
const { default: mongoose } = require("mongoose");

const secret = "mySecretKey";
const setupWebSocket = (server) => {
  const onlineUsers = new Map();
  const wss = new WebSocketServer({ server });

  const broadcastOnlineUsers = () => {
    const onlineList = Array.from(onlineUsers.keys());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "online_users",
            users: onlineList,
          }),
        );
      }
    });
  };

  wss.on("connection", function connection(ws) {
    console.log("Client has connected!");
    ws.on("error", console.error);

    ws.on("close", () => {
      if (ws.user) {
        onlineUsers.delete(ws.user.userId);
        broadcastOnlineUsers();
      }
    });
    ws.on("message", async function message(data) {
      const parsedData = JSON.parse(data.toString());

      if (parsedData.type == "join") {
        if (!ws.user) return;
        // Loading and sending messages if it exists
        const foundMessage = await findMessage(parsedData.conversationId);

        if (foundMessage && foundMessage.length > 0) {
          foundMessage.forEach((msg) => {
            ws.send(JSON.stringify(msg));
          });
        }
      } else if (parsedData.type == "auth") {
        try {
          const decoded = jwt.verify(parsedData.token, secret);
          ws.user = decoded;
          onlineUsers.set(ws.user.userId, ws);
          broadcastOnlineUsers();
        } catch (error) {
          console.log("Auth error while decoding the token:", error);
        }
        return;
      } else if (parsedData.type == "typing") {
        wss.clients.forEach((client) => {
          if (client.user && client.user.userId == parsedData.recieverId) {
            client.send(
              JSON.stringify({
                type: "typing",
                from: ws.user.userId,
              }),
            );
          }
        });
      } else if (parsedData.type == "stop_typing") {
        wss.clients.forEach((client) => {
          if (client.user && client.user.userId == parsedData.recieverId) {
            client.send(
              JSON.stringify({
                type: "stop_typing",
                from: ws.user.userId,
              }),
            );
          }
        });
      } else if (parsedData.type == "seen") {
        const senderId = parsedData.senderId;

        const mes = await Message.updateMany(
          {
            senderId: new mongoose.Types.ObjectId(senderId),
            recieverId: ws.user.userId,
          },
          { status: "seen" },
        );
        // notify the sender
        wss.clients.forEach((client) => {
          if (client.user && client.user.userId == senderId) {
            client.send(
              JSON.stringify({
                type: "seen_update",
                from: ws.user.userId,
              }),
            );
          }
        });
        return;
      } else {
        const senderId = ws.user.userId;
        const recieverId = parsedData.recieverId;

        const finalMessage = parser(
          parsedData.text,
          senderId,
          recieverId,
          ws.user.username,
        );

        const conversationId = [senderId, recieverId].sort().join("_");
        // Creating messages

        const savedMessage = await saveMessage(conversationId, finalMessage);
        console.log("savedMessage:", savedMessage);

        const onlineList = Array.from(onlineUsers.keys());

        wss.clients.forEach(async function each(client) {
          if (
            client.readyState === WebSocket.OPEN &&
            client.user &&
            (client.user.userId == senderId || client.user.userId == recieverId)
          ) {
            if (client.user.userId == recieverId) {
              await Message.updateOne(
                { _id: savedMessage._id },
                { status: "delivered" },
              );
            }
            client.send(JSON.stringify(finalMessage));
          }
        });
      }
    });
  });
};

module.exports = setupWebSocket;
