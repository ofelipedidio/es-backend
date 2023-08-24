const dbConfig = require("../config/db_config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user");
db.mentors = require("./model_mentor.js");
db.mentorias = require("./model_mentoria.js");
db.tags = require("./model_tag.js")

module.exports = db;
