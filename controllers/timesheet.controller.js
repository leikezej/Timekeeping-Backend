// const db = require("../models");
// const Op = db.Sequelize.Op;
// const { user: User, role: Role, timeSheet: TimeSheet } = db;

// // CREATE NEW TIMESHEET
// exports.new = (req, res) => {
//   const timeSheet = {
//     name: req.body.name,
//     time_start: req.body.time_start,
//     time_end: req.body.time_end,
//     time_total: req.body.time_total
//   };
//   TimeSheet.create(timeSheet)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Timein."
//       });
//     }); 
// }

// // GET ALL TIMESHEET
// exports.getAll = (req, res) => {
//     const name = req.query.name;
//     var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
//     TimeSheet.findAll({ where: condition })
//       .then(data => {
//         res.send(data);
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving All TIMESHEETS."
//         });
//       });
// };

// //  GET SINGLE TIMETIMESHEET
// exports.findSheet = (req, res) => {
//     const id = req.params.id;
//     TimeSheet.findByPk(id)
//       .then(data => {
//         if (data) {
//           res.send(data);
//         } else {
//           res.status(404).send({
//             message: `Cannot find TimeSheet with id=${id}.`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error retrieving TimeSheet with id=" + id
//         });
//       });
// };

// // UPDATE SINGLE TIMEIN BY ID
// exports.updateSheet = (req, res) => {
//     const id = req.params.id;
//     TimeSheet.update(req.body, {
//       where: { id: id }
//     })
//       .then(num => {
//         if (num == 1) {
//           res.send({
//             message: "TimeSheet was updated successfully."
//           });
//         } else {
//           res.send({
//             message: `Cannot update TimeSheet with id=${id}. Maybe TimeSheet was not found or req.body is empty!`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Error updating TimeSheet with id=" + id
//         });
//       });
// };

// // DELETE SINGLE TIMESHEET BY ID
// exports.deleteSheet = (req, res) => {
//     const id = req.params.id;
//     TimeSheet.destroy({
//       where: { id: id }
//     })
//       .then(num => {
//         if (num == 1) {
//           res.send({
//             message: "TimeSheet was deleted successfully!"
//           });
//         } else {
//           res.send({
//             message: `Cannot delete TimeSheet with id=${id}. Maybe Timein was not found!`
//           });
//         }
//       })
//       .catch(err => {
//         res.status(500).send({
//           message: "Could not delete TimeSheet with id=" + id
//         });
//       });
// };

// // DELETE ALL TIMESHEET
// exports.deleteAllSheets = (req, res) => {
//   TimeSheet.destroy({
//       where: {},
//       truncate: false
//     })
//       .then(nums => {
//         res.send({ message: `${nums} TimeSheet were deleted successfully!` });
//       })
//       .catch(err => {
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while removing all TimeSheet."
//         });
//       });
// };


