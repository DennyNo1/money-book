const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected successfully" + process.env.MONGO_URL);
}

module.exports = connectToDatabase;
