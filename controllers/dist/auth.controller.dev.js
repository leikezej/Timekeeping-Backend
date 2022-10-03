"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../models");

var config = require("../config/auth.config");

var Op = db.Sequelize.Op;
var User = db.user,
    Role = db.role,
    RefreshToken = db.refreshToken;

var _require = require("uuid"),
    uuidv4 = _require.v4;

var nodemailer = require('nodemailer');

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs"); // REGISTER USER


exports.signup = function (req, res) {
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    // avatar: req.body.avatar,
    password: bcrypt.hashSync(req.body.password, 8)
  }).then(function (user) {
    if (req.body.roles) {
      Role.findAll({
        where: {
          name: _defineProperty({}, Op.or, req.body.roles)
        }
      }).then(function (roles) {
        user.setRoles(roles).then(function () {
          res.send({
            message: 'User was registered with' + '${roles} '
          });
        });
      });
    } else {
      // user role = 1
      user.setRoles([1]).then(function () {
        res.send({
          message: "User was registered successfully!"
        });
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message
    });
  });
}; // LOGIN USER


exports.signin = function _callee(req, res) {
  var user, passwordIsValid, token, refreshToken, authorities, roles, i;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: req.body.email
            }
          }));

        case 3:
          user = _context.sent;

          if (user) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(404).send({
            status: "failed",
            message: "User Not found."
          }));

        case 6:
          passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

          if (passwordIsValid) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(401).send({
            status: "failed",
            message: "Invalid Password!"
          }));

        case 9:
          token = jwt.sign({
            id: user.id
          }, config.secret, {
            expiresIn: 86400 // 24 hours

          });
          _context.next = 12;
          return regeneratorRuntime.awrap(RefreshToken.createToken(user));

        case 12:
          refreshToken = _context.sent;
          authorities = [];
          _context.next = 16;
          return regeneratorRuntime.awrap(user.getRoles());

        case 16:
          roles = _context.sent;

          for (i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }

          req.session.token = token;
          return _context.abrupt("return", res.status(200).send({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: authorities,
            accessToken: token,
            refreshToken: refreshToken
          }));

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).send({
            message: _context.t0.message
          }));

        case 25:
          console.log(Success);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 22]]);
}; // VERIFY USER EMAIL


exports.verify = function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // LOG USER 


exports.loggedUser = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          res.send({
            "user": req.users
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};
/* send reset password link in email */


exports.resetPasswordEmail = function (req, res, next) {
  var email = req.body.email; //console.log(sendEmail(email, fullUrl));

  connection.query('SELECT * FROM users WHERE email ="' + email + '"', function (err, result) {
    if (err) throw err;
    var type = '';
    var msg = '';
    console.log(result[0]);

    if (result[0].email.length > 0) {
      var token = randtoken.generate(20);
      var sent = sendEmail(email, token);

      if (sent != '0') {
        var data = {
          token: token
        };
        connection.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function (err, result) {
          if (err) throw err;
        });
        type = 'success';
        msg = 'The reset password link has been sent to your email address';
      } else {
        type = 'error';
        msg = 'Something goes to wrong. Please try again';
      }
    } else {
      console.log('2');
      type = 'error';
      msg = 'The Email is not registered with us';
    }

    req.flash(type, msg);
    res.redirect('/');
  });
};
/* update password to database */


exports.updatePassword = function (req, res, next) {
  var token = req.body.token;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE token ="' + token + '"', function (err, result) {
    if (err) throw err;
    var type;
    var msg;

    if (result.length > 0) {
      var saltRounds = 10; // var hash = bcrypt.hash(password, saltRounds);

      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          var data = {
            password: hash
          };
          connection.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function (err, result) {
            if (err) throw err;
          });
        });
      });
      type = 'success';
      msg = 'Your password has been updated successfully';
    } else {
      console.log('2');
      type = 'success';
      msg = 'Invalid link; please try again';
    }

    req.flash(type, msg);
    res.redirect('/');
  });
}; // RESET PASSWORD


exports.resetPassword = function (req, res) {
  var _req$body = req.body,
      resetLink = _req$body.resetLink,
      newPassword = _req$body.newPassword;

  if (resetLink) {
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
      if (error) {
        return res.status(401).json({
          error: "Incorrect Token or Expired  "
        });
      }

      User.findOne({
        resetLink: resetLink
      }, function (err, user) {
        if (err || !user) {
          return res.status(401).json({
            error: "This Email Does Not Exist in our Database"
          });
        }
      });
    });
  } else {
    return res.status(401).json({
      error: "Authentication Error!"
    });
  }
}; // CHANGE USER PASSWORD


exports.changeUserPassword = function _callee4(req, res) {
  var _req$body2, password, confirmPassword, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, password = _req$body2.password, confirmPassword = _req$body2.confirmPassword;

          if (!(password !== confirmPassword)) {
            _context4.next = 5;
            break;
          }

          res.send({
            "status": "failed",
            "message": "Error"
          });
          _context4.next = 11;
          break;

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 7:
          salt = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 10:
          newHashPassword = _context4.sent;

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // CHANGE USER PASSWORD


exports.changePassword = function _callee5(req, res) {
  var _req$body3, password, password_confirmation, _req$params, id, token, user, new_secret, salt, newHashPassword;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, password = _req$body3.password, password_confirmation = _req$body3.password_confirmation;
          _req$params = req.params, id = _req$params.id, token = _req$params.token;
          _context5.next = 4;
          return regeneratorRuntime.awrap(UserModel.findById(id));

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
}; // FORGOT PASSWORD


exports.forgotPassword = function (req, res) {
  var id = req.params.id;
  User.update(req.body, {
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "Password Updated"
      });
    } else {
      res.send({
        message: "Cannot Reset, Email Not Found!"
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "error"
    });
  });
}; // SUBMIT OTP


exports.submitOtp = function (req, res) {
  console.log(req.body);
  UserModel.findOne({
    otp: req.body.otp
  }).then(function (result) {
    // UserModel.updateOne({ email: result.email}, { otp: _otp })
    UserModel.updateOne({
      email: result.email
    }, {
      password: req.body.password
    }).then(function (result) {
      res.send({
        code: 200,
        message: 'Password Updated'
      });
    })["catch"](function (error) {
      res.send({
        code: 500,
        message: 'Something Went Wong!'
      });
    });
  })["catch"](function (error) {
    res.send({
      code: 500,
      message: 'Fuck ERROR!'
    });
  });
}; // SEND OTP


exports.sendOtp = function _callee6(req, res) {
  var _otp, user, testAccount, transporter, info;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(req.body); // const _otp = Math.floor(Math.random * 1000000)

          _otp = Math.floor(100000 + Math.random() * 900000);
          console.log(_otp);
          _context6.next = 5;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: req.body.email
          }));

        case 5:
          user = _context6.sent;

          if (!user) {
            res.send({
              code: 500,
              message: 'User Not Found!'
            });
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(nodemailer.createTestAccount());

        case 9:
          testAccount = _context6.sent;
          transporter = nodemailer.createTransport({
            // sendmail: true,
            //    service: 'gmail',
            // host: process.env.HOST,
            // service: process.env.SERVICE,
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS
            }
          });
          _context6.next = 13;
          return regeneratorRuntime.awrap(transporter.sendMail({
            // from: process.env.USER,
            from: "jezedevkiel21@gmail.com",
            to: req.body.email,
            // Listat Mga Email Na Se Sendan
            subject: "OTP Generate",
            text: String(_otp),
            html: "<html>\n            < body >\n               Hello and Welcome\n         </ >\n         </html > "
          }));

        case 13:
          info = _context6.sent;

          if (info.messageId) {
            console.log(info, 84);
            UserModel.updateOne({
              email: req.body.email
            }, {
              otp: _otp
            }).then(function (result) {
              res.send({
                code: 200,
                message: 'OTP Sent'
              });
            })["catch"](function (error) {
              res.send({
                code: 500,
                message: 'Something Went Wong!'
              });
            });
          } else {
            res.send({
              code: 500,
              message: 'Server Error'
            });
          }

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.sendUserPasswordResetEmail = function _callee7(req, res) {
  var email, user, secret, token, link;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          email = req.body.email;

          if (!email) {
            _context7.next = 8;
            break;
          }

          _context7.next = 4;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 4:
          user = _context7.sent;

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

          _context7.next = 9;
          break;

        case 8:
          res.send({
            "status": "failed",
            "message": "Email Field is Required"
          });

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  });
}; // const bcrypt = require('bcryptjs');
// const mailgun = require('mailgun-js');
// const DOMAIN = process.env.DOMAIN_NAME;
// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


exports.forgotPass = function (req, res, next) {
  var email = req.body.email;

  if (!email) {
    return res.status(400).render('forgotPassword', {
      message: 'All fields are mandatory!'
    });
  }

  var sql1 = 'SELECT * from users WHERE email = ?';
  db.query(sql1, [email], function _callee8(err, results) {
    var token, data, sql2;
    return regeneratorRuntime.async(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (!err) {
              _context8.next = 4;
              break;
            }

            throw err;

          case 4:
            if (!results) {
              res.status(401).render('forgotPassword', {
                message: "That email is not registered!"
              });
            }

            token = jwt.sign({
              _id: results[0].uid
            }, process.env.RESET_PASSWORD_KEY, {
              expiresIn: '20m'
            });
            data = {
              from: 'noreplyCMS@mail.com',
              to: email,
              subject: 'Reset Password Link',
              html: "<h2>Please click on given link to reset your password</h2>\n                        <p>".concat(process.env.URL, "/user/resetpassword/").concat(token, "</p>\n                ")
            };
            sql2 = 'UPDATE users SET resetLink = ? WHERE email = ?';
            db.query(sql2, [token, email], function (err, success) {
              if (err) res.render('forgotPassword', {
                message: 'Error in resetLink'
              });else {
                mg.messages().send(data, function (err, body) {
                  if (err) res.render('forgotPassword', {
                    message: err
                  });else {
                    console.log('Email sent!');
                    console.log(body);
                    res.render('forgotPassword', {
                      message: "Email Sent Successfully!"
                    });
                  }
                });
              }
            });

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    });
  });
};

exports.resetPass = function (req, res, next) {
  var _req$body4 = req.body,
      resetLink = _req$body4.resetLink,
      password = _req$body4.password,
      confirmPass = _req$body4.confirmPass;

  if (password !== confirmPass) {
    // This should be handled by flashing a message!
    res.redirect("/user/resetpassword/".concat(resetLink));
  } else {
    if (resetLink) {
      jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (err, data) {
        if (err) {
          res.render('resetPassword', {
            message: "Token Expired"
          });
        } else {
          var sql1 = 'SELECT * FROM users WHERE resetLink = ?';
          db.query(sql1, [resetLink], function _callee9(err, results) {
            var hashed, sql2;
            return regeneratorRuntime.async(function _callee9$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    if (!(err || results.length === 0)) {
                      _context9.next = 4;
                      break;
                    }

                    res.render('resetPassword', {
                      message: "Token Expired"
                    });
                    _context9.next = 9;
                    break;

                  case 4:
                    _context9.next = 6;
                    return regeneratorRuntime.awrap(bcrypt.hash(password, 8));

                  case 6:
                    hashed = _context9.sent;
                    sql2 = 'UPDATE users SET passwrd = ? WHERE resetLink = ?';
                    db.query(sql2, [hashed, resetLink], function (errorData, retData) {
                      if (errorData) {
                        res.render('resetPassword', {
                          message: errorData
                        });
                      } else {
                        // This is the success part!
                        // Follow up : Disable the jwt token : same as logout
                        res.redirect('/user/login');
                      }
                    });

                  case 9:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          });
        }
      });
    } else {
      res.render('resetPassword', {
        message: "Authentication Error!!"
      });
    }
  }
}; // RESET PASSWORD
// exports.reset = async (req, res) => {
//   try {
//       // const schema = Joi.object({ password: Joi.string().required() });
//       const { error } = schema.validate(req.body);
//         if (error) return res.status(400).send(error.details[0].message);
//       const user = await User.findById(req.params.user_id);
//         if (!user) return res.status(400).send("invalid link or expired");
//       const token = await token.findOne({
//           user_id: user._id,
//           token: req.params.token,
//       });
//        if (!token) return res.status(400).send("Invalid link or expired");
//       user.password = req.body.password;
//         await user.save();
//         await token.delete();
//       res.send("password reset sucessfully.");
//   } catch (error) {
//       res.send("An error occured");
//       console.log(error);
//   }
// };
// SIGNOUT
// SIGNOUT USER
// PASSWORD CHANGE
// exports.changePassword = async (req, res) => {
//   const { password, password_confirmation } = req.body
//   if (password && password_confirmation) {
//     if (password !== password_confirmation) {
//       res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
//     } else {
//       const salt = await bcrypt.genSalt(10)
//       const newHashPassword = await bcrypt.hash(password, salt)
//       await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
//       res.send({ "status": "success", "message": "Password changed succesfully" })
//     }
//   } else {
//     res.send({ "status": "failed", "message": "All Fields are Required" })
//   }
// };
// ACTIVATE EMAIL ACCOUNT 
// exports.activateAccount = (req, res) => {
//   const {token} = req.body;
//   if(token) {
//     jwt.verify.token, process.env.JWT_ACC_ACTIVATE, funtionc(err, decodedToken) {
//       if(err) {
//         return res.status(400).json({ error: 'Incorrect or Expired Link'})
//       }
//       const { name, email, password } = decodedToken;
//       User.findOne({email}).exec((err, user) => {
//         if(user) {
//           return res.status(400).json({ error: 'User Email Exists'});
//         }
//         let newUser = new User({ name, email, password});
//         newUser.save((err, success) => {
//           if(err) {
//             console.log("Error", err);
//             return res.status(400).json({ error: 'Error activating'})
//           }
//           res.json({
//             message: "Signup Success"
//           })
//         })
//       });
//     })
// } else {
//   return res.json({error: "Something went wong!"})
//   }
// }