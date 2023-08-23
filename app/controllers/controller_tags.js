const User = require("../models/user");
const Tags = require("../models/model_tag");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nameTag, treated } = req.body;

    const oldTag = await findExistingTag(nameTag);
    let user;
    if (oldTag) {
        res.status(409).send("Tag já existente ou sob análise");
      user = oldTag;
    } else {

      user = await Tags.create({
        nameTag,
        treated,
      });
    }

  } catch (err) {
    console.log(err);
  }
};

exports.delete = async (req, res) => {

  const { nameTag, treated } = req.body;
  const user = await Tags.findOne({ nameTag });
  if (!user) {
    res.status(404).send("User not found!");
  } else {
    user.nameTag = nameTag;
    user.isDeleted = true;
    await user.save();
    res.status(200).json(user);
};
}

exports.findAll = (req, res) => {
  findAllTags()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Erro ocorreu durante fetch!" });
    });
};

exports.findAllUntreated = async (req, res) => {
  findAllUntreatedTags()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Erro ocorreu durante fetch!" });
    });
};

exports.treat = async (req, res) => {
  const { nameTag, treated } = req.body;
  const user = await Tags.findOne({ nameTag });
  if (!user) {
    res.status(404).send("User not found!");
  } else {
    user.nameTag = nameTag;
    user.treated = true;
    await user.save();
    res.status(200).json(user);
  }
};


// Foi necessario o uso de !=true ao invés ==false pois o mongoose aparentemente não salva os default nas tabelas
async function findExistingTag(nameTag) {
  return await Tags.findOne({ nameTag, isDeleted: false});
}

async function findAllTags() {
  return await Tags.find( {treated: true, isDeleted: false });
}

async function findAllUntreatedTags() {
  return await Tags.find( {treated: false, isDeleted: false} );
}




