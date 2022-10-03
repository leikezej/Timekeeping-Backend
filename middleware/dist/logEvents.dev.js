"use strict";

var _require = require('date-fns'),
    format = _require.format;

var _require2 = require('uuid'),
    uuid = _require2.v4;

var ip = require('ip');

var fs = require('fs');

var fsPromises = require('fs').promises;

var path = require('path');

var logEvents = function logEvents(message, logName) {
  var dateTime, logItem;
  return regeneratorRuntime.async(function logEvents$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          dateTime = "".concat(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));
          logItem = "".concat(dateTime, "\t").concat(uuid(), "\t").concat(message, "\n");
          _context.prev = 2;

          if (fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            _context.next = 6;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(fsPromises.mkdir(path.join(__dirname, '..', 'logs')));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem));

        case 8:
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          console.log(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
};

var logger = function logger(req, res, next) {
  logEvents("".concat(req.method, "\t").concat(req.headers.origin, "\t").concat(req.url), 'reqLog.txt');
  console.log("".concat(req.method, " ").concat(req.path)); // console.log(`${res.ip} ${ip}`)

  next();
};

module.exports = {
  logger: logger,
  logEvents: logEvents
};