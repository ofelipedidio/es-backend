const db = require("../models");
const Mentor = db.mentors;
const User = db.users;

// Create and Save a new Mentor
exports.create = (req, res) => {
  // Validate request
  if (!req.body.nome) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Mentor
  const mentor = new Mentor({
    nome: req.body.nome,
    cargo: req.body.cargo,
    tags: req.body.tags,
  });

  // Save Tutorial in the database
  mentor
    .save(mentor)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Mentor.",
      });
    });
};

// Retrieve all Mentors from the database.
exports.findAll = (req, res) => {
  const nome = req.query.nome;
  var condition = nome
    ? { nome: { $regex: new RegExp(nome), $options: "i" } }
    : {};
  console.log(req);

  Mentor.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving mentors.",
      });
    });
};

// Find a single Mentor with a tag
exports.findOne = (req, res) => {
  const tag = req.params.tag;

  Mentor.find({ tags: tag })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Mentor with tag " + tag });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Mentor with tag=" + tag });
    });
};
