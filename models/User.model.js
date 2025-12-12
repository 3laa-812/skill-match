const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill"
  }]
});

module.exports = mongoose.model("User", UserSchema);
