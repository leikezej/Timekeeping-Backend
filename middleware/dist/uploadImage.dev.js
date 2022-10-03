"use strict";

var fs = require('fs');

module.exports = function _callee(req, res, next) {
  var file;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!(!req.files || Object.keys(req.files).length === 0)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            msg: "No files were uploaded."
          }));

        case 3:
          file = req.files.file;

          if (!(file.size > 1024 * 1024)) {
            _context.next = 7;
            break;
          }

          removeTmp(file.tempFilePath);
          return _context.abrupt("return", res.status(400).json({
            msg: "Size too large."
          }));

        case 7:
          if (!(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png')) {
            _context.next = 10;
            break;
          }

          removeTmp(file.tempFilePath);
          return _context.abrupt("return", res.status(400).json({
            msg: "File format is incorrect."
          }));

        case 10:
          next();
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(500).json({
            msg: _context.t0.message
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var removeTmp = function removeTmp(path) {
  fs.unlink(path, function (err) {
    if (err) throw err;
  });
};