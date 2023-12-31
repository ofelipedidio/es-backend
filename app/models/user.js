const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  birthDate: { type: Date, default: null },
  email: { type: String, unique: true },
  password: { type: String },
    birthDate: {type: Date },
  isMentor: { type: Boolean, default: false },
  isMentee: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  token: { type: String },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "mentor" },
},
{ timestamps: true });

module.exports = mongoose.model("user", userSchema);
