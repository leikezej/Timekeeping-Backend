const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");

db.timesheet = require("./timesheet.model");

// db.leave = require("./leave.model");
// db.timein = require("./timein.model");
// db.timeout = require("./timeout.model");

// db.employee = require("./employee.model");

db.ROLES = ["employee", "moderator", "admin"];

module.exports = db;