const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const timeSheetModel = mongoose.model('TimeSheet', timeSheetSchema, "TimeSheet");
module.exports = timeSheetModel;
