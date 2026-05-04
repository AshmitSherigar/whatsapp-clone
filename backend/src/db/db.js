const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MongoDB connected Successfully : ${conn.connection.host} ${conn.connection.name}`,
    );
  } catch (error) {
    console.log(`MongoDB failed to connect : ${error}`);
  }
};
module.exports = connectDB;
