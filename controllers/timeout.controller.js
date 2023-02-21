const db = require("../models");
const Timeout = db.timeout;

exports.create = (req, res) => {
  const timeout = {
    name: req.body.name,
    time: req.body.time,
    date: req.body.date,
    status: req.body.status
  };

  timeout.save(Timeout)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Timeout."
      });
    });
}

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Timeout.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving All Timein Lists."
        });
      });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Timeout.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Timeout with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Timeout with id=" + id
        });
      });
  }

exports.update = (req, res) => {
    const id = req.params.id;
    Timeout.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Timeout was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Timeout with id=${id}. Maybe Timeout was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Timeout with id=" + id
        });
      });
  };

exports.delete = (req, res) => {
    const id = req.params.id;
    Timeout.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Timeout was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Timeout with id=${id}. Maybe Timeout was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Timeout with id=" + id
        });
      });
  };

exports.deleteAll = (req, res) => {
  Timeout.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Timeout were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Timeout."
        });
      });
  };

exports.findAllPublished = (req, res) => {
  Timeout.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Timeout."
        });
      });
  };