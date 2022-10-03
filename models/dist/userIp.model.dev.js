"use strict";

var config = require("../config/auth.config");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var ip = require('ip');

module.exports = function (sequelize, Sequelize) {
  var UserIp = sequelize.define("userIp", {
    ip_address: {
      type: Sequelize.STRING,
      defaultValue: 'ip.address()'
    },
    loginAt: {
      type: Sequelize.DATE
    }
  });

  UserIp.getIp = function _callee(user) {
    var loginAt, _user, UserIp;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            loginAt = new Date();
            loginAt.setSeconds(loginAt.getSeconds() + config.jwtRefreshExpiration);
            _user = uuidv4();
            _context.next = 5;
            return regeneratorRuntime.awrap(this.create({
              // res.send("Your IP address is " + ip.address());
              token: _user,
              id: user.id,
              expiryDate: loginAt.getTime()
            }));

          case 5:
            UserIp = _context.sent;
            return _context.abrupt("return", UserIp.token);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, null, this);
  };

  UserIp.verifyExpiration = function (token) {
    return token.loginAt.getTime() < new Date().getTime();
  };

  return UserIp;
};