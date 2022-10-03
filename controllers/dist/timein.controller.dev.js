"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = require("../models");

var Timein = db.timein;
var Op = db.Sequelize.Op;
var User = db.user,
    Role = db.role;

exports.create = function (req, res) {
  var timein = {
    name: req.body.name,
    time: req.body.time,
    date: req.body.date
  };
  Timein.create(timein).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Timein."
    });
  });
};

exports.findAll = function (req, res) {
  var name = req.query.name;
  var condition = name ? {
    name: _defineProperty({}, Op.like, "%".concat(name, "%"))
  } : null;
  Timein.findAll({
    where: condition
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users."
    });
  });
};

exports.findOne = function (req, res) {
  var id = req.params.id;
  Timein.findByPk(id).then(function (data) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: "Cannot find Tutorial with id=".concat(id, ".")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error retrieving Tutorial with id=" + id
    });
  });
};

exports.update = function (req, res) {
  var id = req.params.id;
  Timein.update(req.body, {
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "Tutorial was updated successfully."
      });
    } else {
      res.send({
        message: "Cannot update Tutorial with id=".concat(id, ". Maybe Tutorial was not found or req.body is empty!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Error updating Tutorial with id=" + id
    });
  });
};

exports["delete"] = function (req, res) {
  var id = req.params.id;
  Timein.destroy({
    where: {
      id: id
    }
  }).then(function (num) {
    if (num == 1) {
      res.send({
        message: "Tutorial was deleted successfully!"
      });
    } else {
      res.send({
        message: "Cannot delete Tutorial with id=".concat(id, ". Maybe Tutorial was not found!")
      });
    }
  })["catch"](function (err) {
    res.status(500).send({
      message: "Could not delete Tutorial with id=" + id
    });
  });
};

exports.deleteAll = function (req, res) {
  Timein.destroy({
    where: {},
    truncate: false
  }).then(function (nums) {
    res.send({
      message: "".concat(nums, " Tutorials were deleted successfully!")
    });
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all tutorials."
    });
  });
};

exports.findAllPublished = function (req, res) {
  Timein.findAll({
    where: {
      published: true
    }
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tutorials."
    });
  });
};