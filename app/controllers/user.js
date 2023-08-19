const User = require("../models/user");
const Mentor = require("../models/model_mentor");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, birthDate, email, password, isMentor, isMentee } = req.body;

    if (!name && !birthDate && !email && !password) {
      res.status(400).send("Necessario preencher todos os campos!");
    }

    const oldUser = await findNonDeletedUserByEmail(email);
    let user;
    if (oldUser) {
      if ((oldUser.isMentor && isMentor) || (oldUser.isMentee && isMentee)) {
        res.status(409).send("Usuario já existe!");
      }
      user = oldUser;
    } else {
      const encryptedPassword = await bycrypt.hash(password, 10);

      user = await User.create({
        name,
        birthDate,
        email: email.toLowerCase(),
        password: encryptedPassword,
        isMentor,
        isMentee,
      });
    }

    if (isMentor) {
      const mentor = await Mentor.create({
        user: user._id,
        cargo: req.body.cargo,
        tags: req.body.tags,
      });
      user.mentor = mentor._id;
      user.isMentor = isMentor;
    }

    if (isMentee) {
      user.isMentee = isMentee;
    }

    user.save();

    authUser(user, email, res, 201);
  } catch (err) {
    console.log(err);
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password, isMentor, isMentee } = req.body;
    if (!(email && password)) {
      res.status(400).send("Todo o login é necessario!");
    }

    let user = await findNonDeletedUserByEmail(email);

    if (!user) {
      res.status(404).send("User not found!");
    }

    if (user && (await bycrypt.compare(password, user.password))) {
      if (isMentor && user) {
        user = await findNonDeletedUserByEmail(email).populate("mentor").exec();
      }
      if ((user.isMentor && isMentor) || (user.isMentee && isMentee)) {
        authUser(user, email, res, 200);
      } else {
        res.status(401).send("Não possui a role!");
      }
    } else {
      res.status(400).send("Credenciais invalidas!");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  const user = await findNonDeletedUserById(id);
  if (user) {
    user.isDeleted = true;
    user.save();
    res.status(200).send();
  } else {
    res.status(404).send("User Not Found!");
  }
};

exports.findAll = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Erro ocorreu durante fetch!" });
    });
};
async function findNonDeletedUserByEmail(email) {
  return await User.findOne({ email, isDeleted: { $eq: false } });
}
async function findNonDeletedUserById(_id) {
  return await User.findOne({ _id });
}
async function findAllUsers() {
  return await User.find({ isDeleted: { $eq: false } });
}

function authUser(user, email, res, status) {
  const token = jwt.sign({ user_id: user._id, email }, "secret_key", {
    expiresIn: "2h",
  });

  user.token = token;

  res.status(status).json(user);
}
