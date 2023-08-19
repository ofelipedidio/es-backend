const db = require("../models");
const Mentor = db.mentors;
const User = db.users;
const Mentoria = db.mentoria;

exports.create = (req, res) => {
    // const start = new Date(res.body.start);
    // const end = new Date(res.body.end);

    // 1
    let qtd_usuario = null;
    User.countDocuments({}, (err, count) => {
        if (err) console.error(err);
        qtd_usuario = count;
    });

    // 2
    let qtd_mentorias = null;
    Mentoria.countDocuments({
        createdAt: {
            $gte: start,
            $lte: end
        }
    }, (err, count) => {
        if (err) console.error(err);
        qtd_mentorias = count;
    });

    // 3
    // Duvida: usuarios criados no tempo ou total que existiam nesse tempo
    // Taxa de mentorias
    let qtd_usuario_tempo = null;
    User.countDocuments({
        createdAt: {
            $lte: enddate
        }
    }, (err, count) => {
        if (err) console.error(err);
        qtd_usuario_tempo = count;
    });

    let taxa_mentorias = qtd_mentorias / qtd_usuario_tempo;

    // 4
    let qtd_experiencias = null;
    Tag.countDocuments({
        createdAt: {
            $gte: start,
            $lte: end
        }
    }, (err, count) => {
        if (err) console.error(err);
        qtd_experiencias = count;
    });

    // 5
    // Duvida: quantidade abs no periodo ou no total (ate agora)?
    let qtd_abs_experiencias = null;
    Tag.countDocuments({}, (err, count) => {
        if (err) console.error(err);
        qtd_abs_experiencias = count;
    });

    const relatorio = {
        qtd_usuario: qtd_usuario,
        qtd_mentorias: qtd_mentorias,
        taxa_mentorias: taxa_mentorias,
        qtd_experiencias: qtd_experiencias,
        qtd_abs_experiencias: qtd_abs_experiencias
    }

    res.status(200).send(relatorio);
};
