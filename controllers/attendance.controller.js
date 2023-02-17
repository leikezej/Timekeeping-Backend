const Attendance = require("../models/attendance");

// Display list of all attendances.
exports.attendance_list = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance list");
};

// Display detail page for a specific attendance.
exports.attendance_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: attendance detail: ${req.params.id}`);
};

// Display attendance create form on GET.
exports.attendance_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance create GET");
};

// Handle attendance create on POST.
exports.attendance_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance create POST");
};

// Display attendance delete form on GET.
exports.attendance_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance delete GET");
};

// Handle attendance delete on POST.
exports.attendance_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance delete POST");
};

// Display attendance update form on GET.
exports.attendance_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance update GET");
};

// Handle attendance update on POST.
exports.attendance_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: attendance update POST");
};