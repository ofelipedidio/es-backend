var mongoose = require("mongoose");
const Mentor = mongoose.model(
  "mentor",
  mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      cargo: { type: String, default: "" },
      tags: [
        {
          type: String,
        },
      ],
    },
    { timestamps: true }
  )
);
module.exports = Mentor;
