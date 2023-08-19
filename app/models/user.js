const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  birthDate: { type: Date, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  isMentor: { type: Boolean, default: false },
  isMentee: { type: Boolean, default: false },
  token: { type: String },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "mentor" },
});

module.exports = mongoose.model("user", userSchema);
