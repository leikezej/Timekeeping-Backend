const db = require("../models");
const Timein = db.timein;

// CREATE NEW TIMEIN
exports.getTimeSheet = (req, res, id, callback) => {
    timein.find({ employeeId: id}, callback)
    .populate({ path: 'time_start'}, )
};