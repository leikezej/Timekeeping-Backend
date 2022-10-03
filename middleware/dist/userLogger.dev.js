"use strict";

var db = require("../models");

var User = db.user;

var ip = require('ip');

getUserIp = function getUserIp(req, res, next) {
  res.end("Your IP address is " + ip.address());
};

getLoggedUser = function getLoggedUser(req, res, next) {
  res.status(200).send({
    "user": req.user
  });
};

var userLogger = {
  getUserIp: getUserIp,
  getLoggedUser: getLoggedUser
};
module.exports = userLogger;