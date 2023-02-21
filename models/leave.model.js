const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSheet = new Schema({
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


const leaveModel = mongoose.model("leave", leaveSheet, "Leave");
module.exports = leaveModel;
