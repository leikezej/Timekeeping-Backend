"use strict";

var db = require("../models");

var config = require("../config/auth.config");

var transporter = require("../config/email.config");

var Op = db.Sequelize.Op;
var User = db.user,
    Role = db.role,
    Roles = db.roles,
    RefreshToken = db.refreshToken;

var fileUpload = require("express-fileupload");

var ip = require('ip');

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs"); // GET IP


exports.getIp = function (req, res) {
  res.end("Your IP address is " + ip.address());
}; // GET ALL RECORDS


exports.getAllRecords = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('Sulod');
          User.findAll({
            attributes: {
              exclude: ['password']
            }
          }).then(function (doc) {
            res.send(doc);
          })["catch"](function (err) {
            console.log(err);
            res.status(500).send({
              message: err.message
            });
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}; // LOGOUT USER


exports.logout = function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          res.clearCookie('refreshtoken', {
            path: '/user/refresh_token'
          });
          return _context2.abrupt("return", res.json({
            msg: "Logged out."
          }));

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).json({
            msg: _context2.t0.message
          }));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 5]]);
}, // GET USER BY EMAIL
exports.findEmail = function (req, res) {
  var email = req.params.email;
  User.findAll(email).then(function (data) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Cannot find User with ".concat(email, ".")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error retrieving User with email=" + email
    });
  });
}; // FIND BY ID

exports.findOne = function (req, res) {
  var id = req.params.id;
  User.findByPk(id).then(function (data) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Cannot find User with id=".concat(id, ".")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error retrieving User with id=" + id
    });
  });
}; // UPDATE USER


exports.update = function (req, res) {
  var id = req.params.id;
  User.update(req.body, {
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: "Cannot update User with id=".concat(id, ". Maybe User was not found or req.body is empty!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error updating User with id=" + id
    });
  });
}; // DELETE USER BY ID


exports["delete"] = function (req, res) {
  var id = req.params.id;
  User.destroy({
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: "Cannot delete User with id=".concat(id, ". Maybe User was not found!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Could not delete User with id=" + id
    });
  });
}; // DELETE ALL USER


exports.deleteAll = function (req, res) {
  User.destroy({
    where: {},
    truncate: false
  }).then(function (nums) {
    res.send({
      message: "".concat(nums, " Users were deleted successfully!")
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all Users."
    });
  });
}; // CHANGE USER PASSWORD


exports.changeUserPassword = function _callee3(req, res) {
  var _req$body, password, password_confirmation, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, password = _req$body.password, password_confirmation = _req$body.password_confirmation;

          if (!(password && password_confirmation)) {
            _context3.next = 17;
            break;
          }

          if (!(password !== password_confirmation)) {
            _context3.next = 6;
            break;
          }

          res.send({
            "status": "failed",
            "message": "New Password and Confirm New Password doesn't match"
          });
          _context3.next = 15;
          break;

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 8:
          salt = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 11:
          newHashPassword = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(req.user._id, {
            $set: {
              password: newHashPassword
            }
          }));

        case 14:
          res.send({
            "status": "success",
            "message": "Password changed succesfully"
          });

        case 15:
          _context3.next = 18;
          break;

        case 17:
          res.send({
            "status": "failed",
            "message": "All Fields are Required"
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // SEND RESET EMAIL LILNK


exports.sendUserPasswordResetEmail = function _callee4(req, res) {
  var email, user, secret, token, link;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.body.email;

          if (!email) {
            _context4.next = 8;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context4.sent;

          if (user) {
            secret = user._id + process.env.RESET_PASSWORD_KEY;
            token = jwt.sign({
              user_id: user._id
            }, secret, {
              expiresIn: '15m'
            });
            link = "http://127.0.0.1:3000/api/user/reset/".concat(user._id, "/").concat(token);
            console.log(link); // let info = await transporter.sendMail({
            //   from: process.env.EMAIL_FROM,
            //   to: user.email,
            //   subject: "Jepski - Password Reset Link",
            //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
            // })

            res.send({
              "status": "success",
              "message": "Password Reset Email Sent... Please Check Your Email"
            });
          } else {
            res.send({
              "status": "failed",
              "message": "Email doesn't exists"
            });
          }

          _context4.next = 9;
          break;

        case 8:
          res.send({
            "status": "failed",
            "message": "Email Field is Required"
          });

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // USER PASSWORD RESET


exports.userPasswordReset = function _callee5(req, res) {
  var _req$body2, password, password_confirmation, _req$params, id, token, user, new_secret, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, password = _req$body2.password, password_confirmation = _req$body2.password_confirmation;
          _req$params = req.params, id = _req$params.id, token = _req$params.token;
          _context5.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(id));

        case 4:
          user = _context5.sent;
          new_secret = user._id + process.env.JWT_SECRET_KEY;
          _context5.prev = 6;
          jwt.verify(token, new_secret);

          if (!(password && password_confirmation)) {
            _context5.next = 24;
            break;
          }

          if (!(password !== password_confirmation)) {
            _context5.next = 13;
            break;
          }

          res.send({
            "status": "failed",
            "message": "New Password and Confirm New Password doesn't match"
          });
          _context5.next = 22;
          break;

        case 13:
          _context5.next = 15;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 15:
          salt = _context5.sent;
          _context5.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 18:
          newHashPassword = _context5.sent;
          _context5.next = 21;
          return regeneratorRuntime.awrap(User.findOne(user._id, {
            $set: {
              password: newHashPassword
            }
          }));

        case 21:
          res.send({
            "status": "success",
            "message": "Password Reset Successfully"
          });

        case 22:
          _context5.next = 25;
          break;

        case 24:
          res.send({
            "status": "failed",
            "message": "All Fields are Required"
          });

        case 25:
          _context5.next = 31;
          break;

        case 27:
          _context5.prev = 27;
          _context5.t0 = _context5["catch"](6);
          console.log(_context5.t0);
          res.send({
            "status": "failed",
            "message": "Invalid Token"
          });

        case 31:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[6, 27]]);
};

exports.allAccess = function (req, res) {
  res.status(200).send("Public Content.");
};

exports.userBoard = function (req, res) {
  res.status(200).send("User Content.");
};

exports.adminBoard = function (req, res) {
  res.status(200).send("Admin Content.");
};

exports.loggedUser = function (req, res) {
  //res.send({ "user": req.user })
  res.status(200).send({
    "user": req.user
  });
};