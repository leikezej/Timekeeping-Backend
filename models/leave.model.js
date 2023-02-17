const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    reason: {
        type: String
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    leave_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending"
    }

}, {timestamps: true})


const leaveModel = mongoose.model("leave", leaveSchema, "Leave");
module.exports = leaveModel;
