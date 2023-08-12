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
    recompensa: req.body.recompensa
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
    const mentor = req.query.mentor;
    var condition = mentor ? { mentor: { $regex: new RegExp(mentor), $options: "i" } } : {};
  
    Mentoria.find(condition)
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