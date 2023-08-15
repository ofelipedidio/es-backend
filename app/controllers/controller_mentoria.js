const db = require("../models");
const Mentoria = db.mentorias;

// Create and Save a new Mentoria
exports.create = (req, res) => {
  // Validate request
  if (!req.body.mentor) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Mentoria
  const mentoria = new Mentoria({
    mentor: req.body.mentor,
    mentorado: req.body.mentorado,
    duracao: req.body.duracao,
    formato: req.body.formato,
    recompensa: req.body.recompensa,
    mentor_email: req.body.mentor_email,
    mentorado_email: req.body.mentorado_email
  });

  // Save Mentoria in the database
  mentoria
    .save(mentoria)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Mentoria."
      });
    });
};

// Retrieve all Mentorias from the database.
exports.findAll = (req, res) => {
    const email = req.query.email;

    Mentoria.find({$or:[{mentorado_email: email},{mentor_email: email}]})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Mentorias."
        });
      });
};