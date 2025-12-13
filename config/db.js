const mongoose = require("mongoose");
const config = require("config");
require("dotenv").config();

// استخدام MONGODB_URI من .env أو من config/default.json
const db = process.env.MONGODB_URI || config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📍 Database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
