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
    mentorado_email: req.body.mentorado_email,
    status: req.body.status
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

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  const status = req.body;

  console.log(status);

  Mentoria.findByIdAndUpdate(id, { $set: req.body }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Mentoria with id=${id}. Maybe Mentoria was not found!`
        });
      } else res.send({ message: "Mentoria was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Mentoria with id=" + id
      });
    });
};