module.exports = app => {
    const mentors = require("../controllers/mentor.js");
  
    var router = require("express").Router();
  
    // Create a new Mentor
    router.post("/", mentors.create);
  
    // Retrieve all Mentors
    router.get("/", mentors.findAll);
  
    // Retrieve a single Mentor with id
    router.get("/:tag", mentors.findOne);
  
    app.use('/api/mentors', router);
  };