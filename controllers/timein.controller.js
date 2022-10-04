const db = require("../models");
const Timein = db.timein;
const Op = db.Sequelize.Op;
const { user: User, role: Role } = db;

// CREATE NEW TIMEIN
exports.create = (req, res) => {
  const timein = {
    name: req.body.name,
    time: req.body.time,
    date: req.body.date,
  };
  
  Timein.create(timein)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Timein."
      });
    }); 
}

// GET ALL TIMEIN
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    
    Timein.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

//  GET SINGLE TIMEIN
exports.findOne = (req, res) => {
    const id = req.params.id;
    Timein.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Timein with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Timein with id=" + id
        });
      });
};

// UPDATE SINGLE TIMEIN BY ID
exports.update = (req, res) => {
    const id = req.params.id;
    Timein.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Timein was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Timein with id=${id}. Maybe Timein was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Timein with id=" + id
        });
      });
};

// DELETE SINGLE TIMEIN BY ID
exports.delete = (req, res) => {
    const id = req.params.id;
    Timein.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Timein was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Timein with id=${id}. Maybe Timein was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Timein with id=" + id
        });
      });
};

// DELETE ALL BY ID
exports.deleteAll = (req, res) => {
  Timein.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Timein were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Timein."
        });
      });
};

exports.findAllPublished = (req, res) => {
  Timein.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Timein."
        });
      });
};