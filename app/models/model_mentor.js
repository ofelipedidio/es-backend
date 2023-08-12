var mongoose = require("mongoose");
const Mentor = mongoose.model(
  "mentor",
  mongoose.Schema(
    {
      user_id: String,
      cargo: String,
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
