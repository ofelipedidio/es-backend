module.exports = (app) => {
  const user = require("../controllers/user.js");
  const mentors = require("../controllers/controller_mentor.js");
  const mentorias = require("../controllers/controller_mentoria.js");
  const auth = require("../middleware/auth.js");

  var router = require("express").Router();

  // Create a new Mentor
  router.post("/mentors", mentors.create);

  router.post("/mentorias", mentorias.create);

  router.get("/mentorias", mentorias.findAll);

  router.put("/mentorias/:id", mentorias.update);

  // Retrieve all Mentors
  router.get("/mentors", mentors.findAll);

  // Retrieve a single Mentor with id
  router.get("/mentors/:tag", mentors.findOne);

  //Retrieve Users
  router.get("/usuario", user.findAll);

  //Create a new User
  router.post("/register", user.register);

  //Login
  router.post("/login", user.login);

  //Delete
  router.post("/delete", user.delete);

  //Update
  router.post("/update", user.update);

  app.use("/api", router);
};
