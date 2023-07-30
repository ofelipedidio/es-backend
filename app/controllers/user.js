const User = require("../models/user");
const bycrypt = require("bycrypt");
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
      password: encryptedPassword(),
    });

    const token = jsonwebtoken.sign(
      {
        user_id: user._id,
        email,
      },
      null,
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
exports.login = (req, res) => {};
