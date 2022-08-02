const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, refreshToken: RefreshToken } = db;


exports.allAccess = (req, res) => {
   res.status(200).send("Public Content.");
 };
 
 exports.userBoard = (req, res) => {
   res.status(200).send("User Content.");
 };
 
 exports.adminBoard = (req, res) => {
   res.status(200).send("Admin Content.");
 };

 exports.moderatorBoard = (req, res) => {
   res.status(200).send("Moderator Content.");
 };

 exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
