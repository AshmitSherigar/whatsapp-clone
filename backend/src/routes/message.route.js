const express = require("express");
const {
  getMessageController,
  getUserController,
} = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth.midddleware");
const router = express.Router();

router.get("/users", authMiddleware, getUserController);
router.get("/conversations", authMiddleware, getMessageController);

module.exports = router;
