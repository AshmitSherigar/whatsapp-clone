require("dotenv").config();
const express = require("express");

const http = require("http");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./db/db");
const User = require("./models/user.model");
const Message = require("./models/message.model");

const setupWebSocket = require("./sockets/socket");

const userRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

const server = http.createServer(app);

connectDB();

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
