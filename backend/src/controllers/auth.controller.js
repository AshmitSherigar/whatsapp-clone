const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

const loginController = async (req, res) => {
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
};

const registerController = async (req, res) => {
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
};

module.exports = { loginController, registerController };
