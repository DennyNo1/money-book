const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected successfully" + process.env.MONGO_URL);
}

module.exports = connectToDatabase;
