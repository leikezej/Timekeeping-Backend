const db = require("../models");
const Timeout = db.timeout;

// CREATE NEW TIMEOUT
exports.create = (req, res) => {
  // Create a Timeout
  const timeout = new Timeout({
      // title: req.body.title || "Untitled Timein", 
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      published: req.body.published ? req.body.published : false
  });

  // Save Timeout in the database
  timeout.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Timein."
      });
  });
};

// GET ALL TIMEOUT
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {};

  Timeout.find(condition)
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

//  GET SINGLE TIMEOUT
exports.findOne = (req, res) => {
    const id = req.params.id;
    Timeout.findById(id)
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
};

// UPDATE SINGLE TIMEOUT BY ID
exports.update = (req, res) => {
  Timeout.findByIdAndUpdate(req.params.id)
    .then((timeout) => {
      timeout.name = req.body.name;
      timeout.time = req.body.time;
      timeout.date = req.body.date;
      timeout
        .save()
        .then(() => res.json("Timeout Updated..."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};
// message: `Cannot delete Timein with id=${id}. Maybe Timein was not found!`


// DELETE SINGLE TIMEOUT BY ID
exports.delete = (req, res) => {
  Timeout.findByIdAndDelete(req.params.id)
    .then(() => res.json(`Timeout with is now Deleted...`))
    .catch((err) => res.status(400).json("Error: " + err));
};

// Find all published Timeout
exports.findAllPublished = (req, res) => {
  Timeout.find({ published: true })
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