"use strict";

var jwt = require("jsonwebtoken");

var db = require("../models");

var models = require("../models/user.model");

var checkUserAuth = function checkUserAuth(req, res, next) {
  var token, authorization, _jwt$verify, user_id;

  return regeneratorRuntime.async(function checkUserAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          authorization = req.headers.authorization;

          if (!(authorization && authorization.startsWith('Bearer'))) {
            _context.next = 15;
            break;
          }

          _context.prev = 2;
          // Get Token from header
          token = authorization.split(' ')[1]; // Verify Token

          _jwt$verify = jwt.verify(token, process.env.JWT_SECRET_KEY), user_id = _jwt$verify.user_id; // Get User from Token

          _context.next = 7;
          return regeneratorRuntime.awrap(User.findById(user_id).select('-password'));

        case 7:
          req.user = _context.sent;
          next();
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](2);
          console.log(_context.t0);
          res.status(401).send({
            "status": "failed",
            "message": "Unauthorized User"
          });

        case 15:
          if (!token) {
            res.status(401).send({
              "status": "failed",
              "message": "Unauthorized User, No Token"
            });
          }

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

module.exports = checkUserAuth;