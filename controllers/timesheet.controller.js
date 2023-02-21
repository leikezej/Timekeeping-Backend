const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Timesheet = new Schema({
    // id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // imprint: { type: String, required: true },
    employee: {
        type: String
    },
    timeIn: {
        type: Date,
        default: Date.now(),
        ref: "User"
    },
    timeOut: {
        type: Date,
        default: Date.now(),
        ref: "User"
    },
    total_hours: {
        type: String,
        required: true
    }

}, {timestamps: true})


const timesheetModel = mongoose.model("timesheet", TimeSheet, "Timesheet");
module.exports = timesheetModel;