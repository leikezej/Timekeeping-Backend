const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaveApplicationSchema = new Schema({
    LeaveType: { type: String, required: true },
    FromDate: { type: Date, required: true },
    ToDate: { type: Date, required: true },
    ReasonForLeave: { type: String, required: true },
    Status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'],  default: "Pending"  },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  });
  
const leavApplicationModel = mongoose.model("LeaveApplication", leaveApplicationSchema, "LeaveApplication");
module.exports = leavApplicationModel;
  