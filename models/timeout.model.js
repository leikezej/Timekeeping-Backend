const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeoutSchema = new Schema({
  name: {
    type: String,
    ref: "User"
  },
  time: {
    type: String,
    ref: "Timesheet"
  },
  date: {
    type: Date,
    default: Date.now()
  },
  published: Boolean,
  attendance:  {
    type:  Boolean,
    default: false,
    ref: "Attendance"
  }
}, {timestamps: true});


const timeoutModel = mongoose.model('Timeout', timeoutSchema, "Timeout");

module.exports = timeoutModel;