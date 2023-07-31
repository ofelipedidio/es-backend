const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(403).send("Token é necessario!");
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token invalido!");
  }
  return next();
};

module.exports = verifyToken;
