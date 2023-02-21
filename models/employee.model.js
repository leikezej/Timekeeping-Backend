const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// const timeinSchema = new Schema({
//   name: {
//     type: String,
//     ref: "User"
//   },
//   time: {
//     type: String,
//     time: "Timeout"
//   },
//   date: {
//     type: Date,
//     default: Date.now()
//   },
//   published: Boolean,
//   attendance:  {
//     type:  Boolean,
//     default: false,
//     ref: "Attendance"
//   }
// });

// const timeoutSchema = new Schema({
//   name: {
//     type: String,
//     ref: "Attendance"
//   },
//   time: {
//     type: String,
//     ref: "Timein"
//   },
//   date: {
//     type: Date,
//     default: Date.now()
//   },
//   published: Boolean,
//   attendance:  {
//     type:  Boolean,
//     default: false,
//     ref: "Attendance"
//   }
// });

const attendanceSchema =  new Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: [{ type: Boolean, default: false }]
});

const leaveSchema = new Schema({
  reason: { type: String },
  employee: {  type: Schema.Types.ObjectId,  ref: "User" },
  leave_status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'],  default: "Pending"  }
});

const timeSheetSchema = new Schema({
  name: {
    type: String,
    ref: "User"
  },
  time_start: {
    type: String,
    // default: timestamps,
    ref: "Timein"
  },
  time_end: {
    type: String,
    default: Date.now(),
    ref: "Timeout"
  },
  total_hors:  {
    default: false,
  },
  published: Boolean,
}, {timestamps: true});

// const timeinModel = mongoose.model("Timein", timeinSchema, "Timein");
// const timeoutModel = mongoose.model("Timeout", timeoutSchema, "Timeout");
const attendanceModel = mongoose.model("Attendance", attendanceSchema, "Attendance");
const leaveModel = mongoose.model("Leave", leaveSchema, "Leave");
const timeSheetModel = mongoose.model('TimeSheet', timeSheetSchema, "TimeSheet");

// module.exports = { timeinModel, timeoutModel, attendanceModel, leaveModel };
module.exports = { attendanceModel, leaveModel, timeSheetModel };

