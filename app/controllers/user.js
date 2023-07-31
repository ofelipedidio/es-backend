const User = require("../models/user");
const bycrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name && !last_name && !email && !password) {
      res.status(400).send("Necessario preencher todos os campos!");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      res.status(409).send("Usuario já existe!");
    }
    const encryptedPassword = await bycrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jsonwebtoken.sign(
      {
        user_id: user._id,
        email,
      },
      "secret_key",
      {
        expiresIn: "2h",
      }
    );
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("Todo o login é necessario!");
    }

    const user = await User.findOne({ email });

    if (user && (await bycrypt.compare(password, user.password))) {
      const token = jsonwebtoken.sign(
        { user_id: user._id, email },
        "secret_key",
        {
          expiresIn: "2h",
        }
      );

      user.token = token;

      res.status(200).json(user);
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
