const mongoose = require("mongoose");
const Mentor = mongoose.model(
  "mentor",
  mongoose.Schema(
    {
      nome: String,
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
