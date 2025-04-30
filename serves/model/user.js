const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastLogin: Date,
  searchHistory: [
    {
      prompt: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

const User=mongoose.model("user",userSchema);

module.exports=User;