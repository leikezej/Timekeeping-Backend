const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, timeout: Timeout } = db;

exports.timeout = (req, res) => {
  User.create({
    name: req.body.name,
    time: req.body.time,
    date: req.body.date,
  })
  // res.status(200).send("timeout Content.");
};
