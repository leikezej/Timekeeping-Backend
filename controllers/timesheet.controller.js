const db = require("../models");
const Timesheet = db.timesheet;

// CREATE NEW TIMESHEET
exports.createIn = (req, res) => {
  const timesheet = new Timesheet({
      name: req.body.name,
      timeStart: req.body.timeStart,
      timeEnd: req.body.timeEnd,
      totalHours:  req.body.totalHours,
      createdAt: req.body.date,
  });

  // Save Timein in the database
  timesheet.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the TimeSheet."
      });
  });
};

// UPDATE SINGLE TIMEIN BY ID
exports.update = (req, res) => {
    Timesheet.findByIdAndUpdate(req.params.id)
    .then((timesheet) => {
      timesheet.name = req.body.name,
      timesheet.timeStart = req.body.timeStart,
      timesheet.timeEnd = req.body.timeEnd,
      timesheet.totalHours = req.body.totalHours,
      timesheet
        .save()
        .then(() => res.json("Timesheet Updated..."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

// GET ALL TIMESHEET
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {};
  
  Timesheet.find(condition)
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

// //  GET SINGLE TIMEIN
// exports.findOne = (req, res) => {
//     const id = req.params.id;
//     Timein.findById(id)
//       .then(data => {
//         if (data) {
//           res.send(data);
//         } else {
//           res.status(404).send({
//             message: `Cannot find Timein with id=${id}.`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error retrieving Timein with id=" + id
//         });
//       });
// };

// // UPDATE SINGLE TIMEIN BY ID
// exports.update = (req, res) => {
//   Timein.findByIdAndUpdate(req.params.id)
//     .then((timein) => {
//       timein.name = req.body.name;
//       timein.time = req.body.time;
//       timein.date = req.body.date;
//       timein
//         .save()
//         .then(() => res.json("Timein Updated..."))
//         .catch((err) => res.status(400).json("Error: " + err));
//     })
//     .catch((err) => res.status(400).json("Error: " + err));
// };
// // message: `Cannot delete Timein with id=${id}. Maybe Timein was not found!`


// DELETE SINGLE TIMEIN BY ID
exports.delete = (req, res) => {
    Timesheet.findByIdAndDelete(req.params.id)
    .then(() => res.json(`Timesheet with is now Deleted...`))
    .catch((err) => res.status(400).json("Error: " + err));
};

// // Find all published Tutorials
// exports.findAllPublished = (req, res) => {
//   Timein.find({ published: true })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Timein."
//       });
//     });
// };