const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeSheet = new Schema({
    // id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // imprint: { type: String, required: true },
    reason: {
        type: String
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    leave_status: {
        type: String,
        required: true,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: "Pending"
    }

}, {timestamps: true})


const leaveModel = mongoose.model("timesheet", timeSheet, "Timesheet");
module.exports = leaveModel;
