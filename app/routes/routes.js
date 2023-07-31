module.exports = (app) => {
  const mentors = require("../controllers/mentor.js");
  const user = require("../controllers/user.js");

  var router = require("express").Router();

  // Create a new Mentor
  router.post("/", mentors.create);

  // Retrieve all Mentors
  router.get("/", mentors.findAll);
  //Retrieve Users
  router.get("/usuario", user.findAll);

  //Create a new User
  router.post("/register", user.register);

  //Login
  router.post("/login", user.login);

  // Retrieve a single Mentor with id
  router.get("/:tag", mentors.findOne);

  app.use("/api/mentors", router);
};
