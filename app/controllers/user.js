const User = require("../models/user");
const Mentor = require("../models/model_mentor");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, isMentor, isMentee, birthDate } =
      req.body;

    if (!first_name && !last_name && !email && !password) {
      res.status(400).send("Necessario preencher todos os campos!");
    }

    const oldUser = await User.findOne({ email });
    let user;
    if (oldUser) {
      if ((oldUser.isMentor && isMentor) || (oldUser.isMentee && isMentee)) {
        res.status(409).send("Usuario já existe!");
      }
      user = oldUser;
    } else {
      const encryptedPassword = await bycrypt.hash(password, 10);

      user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
          birthDate: birthDate,
        password: encryptedPassword,
        isMentor: req.body.isMentor,
        isMentee: req.body.isMentee,
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
      console.log(req.body);
    const { email, password, isMentor, isMentee } = req.body;
    if (!(email && password)) {
      res.status(400).send("Todo o login é necessario!");
    }

    const user = await User.findOne({ email });

    if (user && (await bycrypt.compare(password, user.password))) {
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
function authUser(user, email, res, status) {
  const token = jwt.sign({ user_id: user._id, email }, "secret_key", {
    expiresIn: "2h",
  });

  user.token = token;

  res.status(status).json(user);
}
