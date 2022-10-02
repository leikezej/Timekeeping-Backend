const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateNameOrEmail = (req, res, next) => {
  // Name
  User.findOne({
    where: {
      name: req.body.name,
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Name is already in use!"
      });
      return;
    }


    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
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


checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
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


const verifySignUp = {
  checkDuplicateNameOrEmail: checkDuplicateNameOrEmail,
  checkRolesExisted: checkRolesExisted
};
module.exports = verifySignUp;