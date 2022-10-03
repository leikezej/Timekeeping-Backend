"use strict";

var db = require("../models");

var ROLES = db.ROLES;
var User = db.user;

checkDuplicateNameOrEmail = function checkDuplicateNameOrEmail(req, res, next) {
  // Name
  User.findOne({
    where: {
      name: req.body.name
    }
  }).then(function (user) {
    if (user) {
      res.status(400).send({
        message: "Failed! Name is already in use!"
      });
      return;
    } // Email


    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(function (user) {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    for (var i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};

var verifySignUp = {
  checkDuplicateNameOrEmail: checkDuplicateNameOrEmail,
  checkRolesExisted: checkRolesExisted
};
module.exports = verifySignUp;