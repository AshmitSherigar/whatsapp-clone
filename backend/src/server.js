require("dotenv").config();
const express = require("express");

const http = require("http");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./db/db");
const User = require("./models/user.model");
const Message = require("./models/message.model");

const setupWebSocket = require("./sockets/socket");

const app = express();
const PORT = process.env.PORT || 5000;
const secret = "mySecretKey";

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid Input | Missing username or password",
      success: false,
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({
      message: "User doesnt exists!",
      success: false,
    });
  }

  if (user.password != password) {
    return res.status(400).json({
      message: "Passwords dont match!",
      success: false,
    });
  }

  
  const token = jwt.sign(
    { username: user?.username, userId: user?._id },
    secret,
  );

  return res.status(200).json({
    token,
    message: "User Login Successfully",
    success: true,
    user: {
      username: user.username,
      userId: user._id,
    },
  });
});
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid Input | Missing username or password",
      success: false,
    });
  }

  const user = await User.findOne({ username });

  if (user) {
    return res.status(400).json({
      message: "User Exists | Please try another username!",
      success: false,
    });
  }

  const savedUser = await User.create({ username, password });
  const token = jwt.sign(
    { username: savedUser?.username, userId: savedUser._id },
    secret,
  );

  return res.status(200).json({
    token,
    message: "User Login Successfully",
    success: true,
    user: {
      username: savedUser.username,
      userId: savedUser._id,
    },
  });
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "_id username");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
});
app.get("/conversations/:userId", async (req, res) => {
  const userId = req.params.userId;

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
});

const server = http.createServer(app);

connectDB();

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
