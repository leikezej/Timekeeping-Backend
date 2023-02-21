const db = require("../models");
const Timein = db.timein;

// CREATE NEW TIMEIN
exports.create = (req, res) => {
  // Create a Timein
  const timein = new Timein({
      // title: req.body.title || "Untitled Timein", 
      name: req.body.name,
      time: req.body.time,
      date: req.body.date,
      published: req.body.published ? req.body.published : false
  });

  // Save Timein in the database
  timein.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Timein."
      });
  });
};

// GET ALL TIMEIN
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {};
  
  Timein.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

//  GET SINGLE TIMEIN
exports.findOne = (req, res) => {
    const id = req.params.id;
    Timein.findById(id)
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
  Timein.findByIdAndUpdate(req.params.id)
    .then((timein) => {
      timein.name = req.body.name;
      timein.time = req.body.time;
      timein.date = req.body.date;
      timein
        .save()
        .then(() => res.json("Timein Updated..."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};
// message: `Cannot delete Timein with id=${id}. Maybe Timein was not found!`


// DELETE SINGLE TIMEIN BY ID
exports.delete = (req, res) => {
  Timein.findByIdAndDelete(req.params.id)
    .then(() => res.json(`Timein with is now Deleted...`))
    .catch((err) => res.status(400).json("Error: " + err));
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};