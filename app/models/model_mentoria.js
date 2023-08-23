var mongoose = require('mongoose');
    const Mentoria = mongoose.model(
        "mentoria",
        mongoose.Schema(
        {
            mentor: String,
            mentorado: String,
            duracao: String,
            formato: String,
            recompensa: String,
            mentor_email: String,
            mentorado_email: String,
            status: String,
            rating_mentor: String,
            rating_mentorado: String,
        },
        { timestamps: true }
      )
    );
module.exports = Mentoria;