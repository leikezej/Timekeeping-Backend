const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeSheetSchema = new Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  time_start: {
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Timein"
  },
  time_end: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Timeout"
  },
  total_hours:  {
    default: false,
  },
  published: Boolean,
}, {timestamps: true});

const timeSheetModel = mongoose.model('TimeSheet', timeSheetSchema, "TimeSheet");
module.exports = timeSheetModel;
