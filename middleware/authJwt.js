const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

const User = db.user;

const { TokenExpiredError } = jwt;
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const verifyToken = (req, res, next) => {
  let token = req.header["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user_id = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.user_id).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
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
};

// isModeratorOrAdmin = async (req, res, next) => {
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

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  // isModerator,
  // isModeratorOrAdmin,
};

module.exports = authJwt;