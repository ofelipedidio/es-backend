const db = require("../models");
const Mentor = db.mentors;
const User = db.users;
const Mentoria = db.mentorias;
const Tag = db.tags;

exports.generate = (req, res) => {
  console.log(
    "==========================comecou request============================================="
  );
  console.log(req.body);
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);
  console.log(start, end);

  let qtd_usuario = null;
  User.countDocuments({})
    .catch((err) => {
      console.log("Could not count users");
    })
    .then((count) => {
      qtd_usuario = count;
      console.log("Quantidade de Users ", count);

      let qtd_mentorias = null;
      Mentoria.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
        .then((count) => {
          qtd_mentorias = count;
          console.log("Mentorias ", qtd_mentorias);
          let qtd_usuario_tempo = null;
          User.countDocuments({
            createdAt: {
              $gte: start,
              $lte: end,
            },
          })
            .then((count) => {
              qtd_usuario_tempo = count;
              console.log("Quantidade de User ", count);

              let taxa_mentorias;

              if (qtd_usuario_tempo == 0) {
                taxa_mentorias = -1;
              } else {
                taxa_mentorias = (qtd_mentorias / qtd_usuario_tempo).toFixed(2);
              }
              console.log("Taxa de Users", taxa_mentorias);

              // 4
              let qtd_experiencias = -1;
              Tag.countDocuments({
                createdAt: {
                  $gte: start,
                  $lte: end,
                },
              })
                .then((count) => {
                  console.log(count);
                  qtd_experiencias = count;
                })
                .catch((err) => {});

              let qtd_abs_experiencias = -1;
              Tag.countDocuments({})
                .then((count) => {
                  qtd_abs_experiencias = count;
                })
                .catch((err) => {});

              const relatorio = {
                qtd_usuario: qtd_usuario,
                qtd_mentorias: qtd_mentorias,
                taxa_mentorias: taxa_mentorias,
                qtd_experiencias: qtd_experiencias,
                qtd_abs_experiencias: qtd_abs_experiencias,
              };

              res.status(200).send(relatorio);
            })
            .catch((err) => {});
        })
        .catch((err) => {
          console.error(err);
        });
    });
};
