const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
  try {
    const jwt_token = req.headers.authorization || req.headers.Authorization;
    console.log(jwt_token);

    if (!jwt_token || !jwt_token.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid Token Format" });
    }
    const token = jwt_token.split(" ")[1];
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ status: false, message: "Wrong Token , Please Try Again!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = authMiddleware;
