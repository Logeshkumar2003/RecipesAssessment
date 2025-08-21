const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/recipes_db");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

module.exports = connectDB;
