var mongoose = require("mongoose");
const Tags = mongoose.model(
  "tags",
  mongoose.Schema(
    {
      nameTag: { type: String},
      treated: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  )
);
module.exports = Tags;
