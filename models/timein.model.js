const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeinSchema = new Schema({
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


const timeinModel = mongoose.model('Timein', timeinSchema, "Timein");

module.exports = timeinModel;