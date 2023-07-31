var mongoose = require('mongoose');
    const Mentoria = mongoose.model(
        "mentoria",
        mongoose.Schema(
        {
            mentor: String,
            mentorado: String,
            duracao: String,
            formato: String,
            recompensa: String
        },
        { timestamps: true }
      )
    );
module.exports = Mentoria;