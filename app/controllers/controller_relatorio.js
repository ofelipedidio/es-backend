const db = require("../models");
const Mentor = db.mentors;
const User = db.users;
const Mentoria = db.mentorias;
const Tag = db.tags;

exports.generate = async (req, res) => {
  console.log(
    "==========================comecou request============================================="
  );
  console.log(req.body);
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);
  console.log(start, end);

  try {
    const qtd_usuario = await User.countDocuments({});
    console.log("Quantidade de Users ", qtd_usuario);

    const qtd_mentorias = await Mentoria.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    console.log("Mentorias ", qtd_mentorias);

    const qtd_usuario_tempo = await User.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    console.log("Quantidade de User ", qtd_usuario_tempo);

    let taxa_mentorias;

    if (qtd_usuario_tempo == 0) {
      taxa_mentorias = -1;
    } else {
      taxa_mentorias = (qtd_mentorias / qtd_usuario_tempo).toFixed(2);
    }
    console.log("Taxa de Users", taxa_mentorias);

    let qtd_experiencias = -1;
    qtd_experiencias = await Tag.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
      treated: true,
    });
    console.log("Quantidade de Experiencias", qtd_experiencias);

    let qtd_abs_experiencias = -1;
    qtd_abs_experiencias = await Tag.countDocuments({ treated: true });

    const relatorio = {
      qtd_usuario: qtd_usuario,
      qtd_mentorias: qtd_mentorias,
      taxa_mentorias: taxa_mentorias,
      qtd_experiencias: qtd_experiencias,
      qtd_abs_experiencias: qtd_abs_experiencias,
    };

    console.log(relatorio);
    res.status(200).send(relatorio);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred.");
  }
};
