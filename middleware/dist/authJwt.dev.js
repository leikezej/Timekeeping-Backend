"use strict";

var jwt = require("jsonwebtoken");

var config = require("../config/auth.config.js");

var db = require("../models");

var User = db.user;
var TokenExpiredError = jwt.TokenExpiredError;

var catchError = function catchError(err, res) {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      message: "Unauthorized! Access Token was expired!"
    });
  }

  return res.sendStatus(401).send({
    message: "Unauthorized!"
  });
};

var verifyToken = function verifyToken(req, res, next) {
  var token = req.header["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return catchError(err, res);
    }

    req.user_id = decoded.id;
    next();
  });
};

isAdmin = function isAdmin(req, res, next) {
  User.findByPk(req.user_id).then(function (user) {
    user.getRoles().then(function (roles) {
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
}; // isModeratorOrAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.userId);
//     const roles = await user.getRoles();
//     for (let i = 0; i < roles.length; i++) {
//       if (roles[i].name === "moderator") {
//         return next();
//       }
//       if (roles[i].name === "admin") {
//         return next();
//       }
//     }
//     return res.status(403).send({
//       message: "Require Moderator or Admin Role!",
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Unable to validate Moderator or Admin role!",
//     });
//   }
// };
// isModerator = async (req, res, next) => {
//   try {
//     const user = await User.findByPk(req.userId);
//     const roles = await user.getRoles();
//     for (let i = 0; i < roles.length; i++) {
//       if (roles[i].name === "moderator") {
//         return next();
//       }
//     }
//     return res.status(403).send({
//       message: "Require Moderator Role!",
//     });
//   } catch (error) {
//     return res.status(500).send({
//       message: "Unable to validate Moderator role!",
//     });
//   }
// };


var authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin // isModerator,
  // isModeratorOrAdmin,

};
module.exports = authJwt;