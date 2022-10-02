"use strict";

var db = require("../models");

var config = require("../config/auth.config");

var transporter = require("../config/email.config");

var Op = db.Sequelize.Op;
var User = db.user,
    Role = db.role,
    Roles = db.roles,
    RefreshToken = db.refreshToken;

var fileUpload = require("express-fileupload"); // GET ALL RECORDS


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


exports.logoutUser = function _callee2(req, res) {
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
}; // UPLOAD PROFILE


exports.uploadProfile = function _callee4(req, res, next) {
  var id, user, profile, fileSize, fileExt, fileName;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(id));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: "Resource not found"
          }));

        case 7:
          profile = req.files.profile;
          fileSize = profile.size / 1000;
          fileExt = profile.name.split(".")[1];

          if (!(fileSize > 500)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "file size must be lower than 500kb"
          }));

        case 12:
          if (["jpg", "png"].includes(fileExt)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "file extension must be jpg or png"
          }));

        case 14:
          fileName = "".concat(req.params.id).concat(path.extname(profile.name));
          profile.mv("/uploads/".concat(fileName), function _callee3(err) {
            return regeneratorRuntime.async(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!err) {
                      _context3.next = 3;
                      break;
                    }

                    console.log(err);
                    return _context3.abrupt("return", res.status(500).send(err));

                  case 3:
                    _context3.next = 5;
                    return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
                      profile: fileName
                    }));

                  case 5:
                    res.status(200).json({
                      data: {
                        file: "".concat(req.protocol, "://").concat(req.get("host"), "/").concat(fileName)
                      }
                    });

                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }
            });
          });
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          res.status(500).json({
            message: "Internal Server Error"
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
}; // ACTIVATE EMAIL


exports.activateEmail = function _callee5(req, res) {
  var activation_token, user, name, email, password, check, newUser;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          activation_token = req.body.activation_token;
          user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
          name = user.name, email = user.email, password = user.password;
          _context5.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 6:
          check = _context5.sent;

          if (!check) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            msg: "This email already exists."
          }));

        case 9:
          newUser = new User({
            name: name,
            email: email,
            password: password
          });
          _context5.next = 12;
          return regeneratorRuntime.awrap(newUser.save());

        case 12:
          res.json({
            msg: "Account has been activated!"
          });
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.status(500).json({
            msg: _context5.t0.message
          }));

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
}, // FORGOT PASSWORD
exports.forgotPassword = function _callee6(req, res) {
  var email, user, access_token, url;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          email = req.body.email;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 4:
          user = _context6.sent;

          if (user) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            msg: "This email does not exist."
          }));

        case 7:
          access_token = createAccessToken({
            id: user._id
          });
          url = "".concat(CLIENT_URL, "/user/reset/").concat(access_token);
          sendMail(email, url, "Reset your password");
          res.json({
            msg: "Re-send the password, please check your email."
          });
          _context6.next = 16;
          break;

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(500).json({
            msg: _context6.t0.message
          }));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
}, // RESET PASSWORD
exports.resetPassword = function _callee7(req, res) {
  var password, passwordHash;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          password = req.body.password;
          console.log(password);
          _context7.next = 5;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

        case 5:
          passwordHash = _context7.sent;
          _context7.next = 8;
          return regeneratorRuntime.awrap(Users.findOneAndUpdate({
            _id: req.user.id
          }, {
            password: passwordHash
          }));

        case 8:
          res.json({
            msg: "Password successfully changed!"
          });
          _context7.next = 14;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.status(500).json({
            msg: _context7.t0.message
          }));

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
}, exports.allAccess = function (req, res) {
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
}; // GOOGLE LOGIN


exports.googleLogin = function _callee8(req, res) {
  var tokenId, verify, _verify$payload, email_verified, email, name, picture, password, passwordHash, user, isMatch, refresh_token, newUser, _refresh_token;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          tokenId = req.body.tokenId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.MAILING_SERVICE_CLIENT_ID
          }));

        case 4:
          verify = _context8.sent;
          _verify$payload = verify.payload, email_verified = _verify$payload.email_verified, email = _verify$payload.email, name = _verify$payload.name, picture = _verify$payload.picture;
          password = email + process.env.GOOGLE_SECRET;
          _context8.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

        case 9:
          passwordHash = _context8.sent;

          if (email_verified) {
            _context8.next = 12;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            msg: "Email verification failed."
          }));

        case 12:
          _context8.next = 14;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 14:
          user = _context8.sent;

          if (!user) {
            _context8.next = 26;
            break;
          }

          _context8.next = 18;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 18:
          isMatch = _context8.sent;

          if (isMatch) {
            _context8.next = 21;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            msg: "Password is incorrect."
          }));

        case 21:
          refresh_token = createRefreshToken({
            id: user._id
          });
          res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

          });
          res.json({
            msg: "Login success!"
          });
          _context8.next = 32;
          break;

        case 26:
          newUser = new Users({
            name: name,
            email: email,
            password: passwordHash,
            avatar: picture
          });
          _context8.next = 29;
          return regeneratorRuntime.awrap(newUser.save());

        case 29:
          _refresh_token = createRefreshToken({
            id: newUser._id
          });
          res.cookie('refreshtoken', _refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

          });
          res.json({
            msg: "Login success!"
          });

        case 32:
          _context8.next = 37;
          break;

        case 34:
          _context8.prev = 34;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", res.status(500).json({
            msg: _context8.t0.message
          }));

        case 37:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 34]]);
}; // FACEBOOK LOGIN


exports.facebookLogin = function _callee9(req, res) {
  var _req$body, accessToken, userID, URL, data, email, name, picture, password, passwordHash, user, isMatch, refresh_token, newUser, _refresh_token2;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body = req.body, accessToken = _req$body.accessToken, userID = _req$body.userID;
          URL = "https://graph.facebook.com/v2.9/".concat(userID, "/?fields=id,name,email,picture&access_token=").concat(accessToken);
          _context9.next = 5;
          return regeneratorRuntime.awrap(fetch(URL).then(function (res) {
            return res.json();
          }).then(function (res) {
            return res;
          }));

        case 5:
          data = _context9.sent;
          email = data.email, name = data.name, picture = data.picture;
          password = email + process.env.FACEBOOK_SECRET;
          _context9.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

        case 10:
          passwordHash = _context9.sent;
          _context9.next = 13;
          return regeneratorRuntime.awrap(Users.findOne({
            email: email
          }));

        case 13:
          user = _context9.sent;

          if (!user) {
            _context9.next = 25;
            break;
          }

          _context9.next = 17;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 17:
          isMatch = _context9.sent;

          if (isMatch) {
            _context9.next = 20;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            msg: "Password is incorrect."
          }));

        case 20:
          refresh_token = createRefreshToken({
            id: user._id
          });
          res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

          });
          res.json({
            msg: "Login success!"
          });
          _context9.next = 31;
          break;

        case 25:
          newUser = new Users({
            name: name,
            email: email,
            password: passwordHash,
            avatar: picture.data.url
          });
          _context9.next = 28;
          return regeneratorRuntime.awrap(newUser.save());

        case 28:
          _refresh_token2 = createRefreshToken({
            id: newUser._id
          });
          res.cookie('refreshtoken', _refresh_token2, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

          });
          res.json({
            msg: "Login success!"
          });

        case 31:
          _context9.next = 36;
          break;

        case 33:
          _context9.prev = 33;
          _context9.t0 = _context9["catch"](0);
          return _context9.abrupt("return", res.status(500).json({
            msg: _context9.t0.message
          }));

        case 36:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 33]]);
}; // const createActivationToken = (payload) => {
//     return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
// }
// const createAccessToken = (payload) => {
//     return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
// }
// const createRefreshToken = (payload) => {
//     return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
// }


exports.changeUserPassword = function _callee10(req, res) {
  var _req$body2, password, password_confirmation, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body2 = req.body, password = _req$body2.password, password_confirmation = _req$body2.password_confirmation;

          if (!(password && password_confirmation)) {
            _context10.next = 17;
            break;
          }

          if (!(password !== password_confirmation)) {
            _context10.next = 6;
            break;
          }

          res.send({
            "status": "failed",
            "message": "New Password and Confirm New Password doesn't match"
          });
          _context10.next = 15;
          break;

        case 6:
          _context10.next = 8;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 8:
          salt = _context10.sent;
          _context10.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 11:
          newHashPassword = _context10.sent;
          _context10.next = 14;
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
          _context10.next = 18;
          break;

        case 17:
          res.send({
            "status": "failed",
            "message": "All Fields are Required"
          });

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  });
};

exports.loggedUser = function _callee11(req, res) {
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          res.send({
            "user": req.user
          });

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
};

exports.sendUserPasswordResetEmail = function _callee12(req, res) {
  var email, user, secret, token, link;
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          email = req.body.email;

          if (!email) {
            _context12.next = 8;
            break;
          }

          _context12.next = 4;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 4:
          user = _context12.sent;

          if (user) {
            secret = user._id + process.env.JWT_SECRET_KEY;
            token = jwt.sign({
              userID: user._id
            }, secret, {
              expiresIn: '15m'
            });
            link = "http://127.0.0.1:3000/api/user/reset/".concat(user._id, "/").concat(token);
            console.log(link); // // Send Email
            // let info = await transporter.sendMail({
            //   from: process.env.EMAIL_FROM,
            //   to: user.email,
            //   subject: "GeekShop - Password Reset Link",
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

          _context12.next = 9;
          break;

        case 8:
          res.send({
            "status": "failed",
            "message": "Email Field is Required"
          });

        case 9:
        case "end":
          return _context12.stop();
      }
    }
  });
};

exports.userPasswordReset = function _callee13(req, res) {
  var _req$body3, password, password_confirmation, _req$params, id, token, user, new_secret, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body3 = req.body, password = _req$body3.password, password_confirmation = _req$body3.password_confirmation;
          _req$params = req.params, id = _req$params.id, token = _req$params.token;
          _context13.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(id));

        case 4:
          user = _context13.sent;
          new_secret = user._id + process.env.JWT_SECRET_KEY;
          _context13.prev = 6;
          jwt.verify(token, new_secret);

          if (!(password && password_confirmation)) {
            _context13.next = 24;
            break;
          }

          if (!(password !== password_confirmation)) {
            _context13.next = 13;
            break;
          }

          res.send({
            "status": "failed",
            "message": "New Password and Confirm New Password doesn't match"
          });
          _context13.next = 22;
          break;

        case 13:
          _context13.next = 15;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 15:
          salt = _context13.sent;
          _context13.next = 18;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 18:
          newHashPassword = _context13.sent;
          _context13.next = 21;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(user._id, {
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
          _context13.next = 25;
          break;

        case 24:
          res.send({
            "status": "failed",
            "message": "All Fields are Required"
          });

        case 25:
          _context13.next = 31;
          break;

        case 27:
          _context13.prev = 27;
          _context13.t0 = _context13["catch"](6);
          console.log(_context13.t0);
          res.send({
            "status": "failed",
            "message": "Invalid Token"
          });

        case 31:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[6, 27]]);
};