module.exports = app => {
    const mentors = require("../controllers/controller_mentor.js");
    const mentorias = require("../controllers/controller_mentoria.js");
    const user = require("../controllers/user.js");
    const auth = require("../middleware/auth.js");
  
    var router = require("express").Router();
  
    // Create a new Mentor
    router.post("/mentors", mentors.create);

    router.post("/mentorias", mentorias.create);

    router.get("/mentorias", mentorias.findAll);
  
    // Retrieve all Mentors
    router.get("/mentors", mentors.findAll);
  
    // Retrieve a single Mentor with id
    router.get("/mentors/:tag", mentors.findOne);
  
    app.use('/api', router);
  };
