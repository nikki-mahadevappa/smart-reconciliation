const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: {
    type: String,
    enum: ["ADMIN", "ANALYST", "VIEWER"],
    default: "VIEWER"
  }
});

console.log("User model loaded");

module.exports = mongoose.model("User", userSchema);
