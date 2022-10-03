"use strict";

var db = require("../models");

var config = require("../config/auth.config");

var Op = db.Sequelize.Op; // const { user: User, role: Role, email: email, refreshToken: RefreshToken } = db;

exports.usePasswordHashToMakeToken = function (_ref) {
  var passwordHash = _ref.password,
      user_id = _ref._id,
      createdAt = _ref.createdAt;
  // highlight-start
  var secret = passwordHash + "-" + createdAt;
  var token = jwt.sign({
    user_id: user_id
  }, secret, {
    expiresIn: 3600 // 1 hour

  }); // highlight-end

  return token;
}; // getPasswordResetURL


exports.sendPasswordResetEmail = function _callee(req, res) {
  var email, user, token, url, emailTemplate, sendEmail;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.params.email;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(user.findOne({
            email: email
          }).exec());

        case 4:
          user = _context.sent;
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          res.status(404).json("No user with that email");

        case 10:
          token = usePasswordHashToMakeToken(user);
          url = getPasswordResetURL(user, token);
          emailTemplate = resetPasswordTemplate;
          resetPasswordTemplate(user, url);

          sendEmail = function sendEmail() {
            transporter.sendMail(emailTemplate, function (err, info) {
              if (err) {
                res.status(500).json("Error sending email");
              }

              console.log("** Email sent **", info.response);
            });
          };

          sendEmail();

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
}; // receiveNewPassword


exports.receiveNewPassword = function (req, res) {
  var _req$params = req.params,
      user_id = _req$params.user_id,
      token = _req$params.token;
  var password = req.body.password; // highlight-start

  User.findOne({
    _id: user_id
  }).then(function (user) {
    var secret = user.password + "-" + user.createdAt;
    var payload = jwt.decode(token, secret);

    if (payload.user_id === user.id) {
      bcrypt.genSalt(10, function (err, salt) {
        // Call error-handling middleware:
        if (err) return;
        bcrypt.hash(password, salt, function (err, hash) {
          // Call error-handling middleware:
          if (err) return;
          User.findOneAndUpdate({
            _id: user_id
          }, {
            password: hash
          }).then(function () {
            return res.status(202).json("Password changed accepted");
          })["catch"](function (err) {
            return res.status(500).json(err);
          });
        });
      });
    }
  })["catch"](function () {
    res.status(404).json("Invalid user");
  });
}; //  


exports.changePassword = function _callee2(req, res) {
  var _req$body, email, oldPassword, newPassword;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, oldPassword = _req$body.oldPassword, newPassword = _req$body.newPassword; // find if old password is valid

          User.findOne({
            email: email
          }).then(function (oldUser) {
            if (!oldUser) return res.status(404).send("User does not exist");
            oldUser.comparePassword(oldPassword, function (err, isMatch) {
              if (err) {
                return res.status(401).send("Unauthorized");
              }

              if (isMatch) {
                // change to new password
                oldUser.password = newPassword;
                oldUser.save().then(function (newUser) {
                  res.status(200).send(newUser);
                })["catch"](function (err) {
                  var message = err.message;
                  res.status(500).json({
                    status: "change password failed",
                    msg: message
                  });
                });
              } else {
                return res.status(401).send("Invalid old password");
              }
            });
          })["catch"](function (err) {
            res.status(500).send(err);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};