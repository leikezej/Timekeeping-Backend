const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeinSchema = new Schema({
  name: {
    type: String,
    ref: "User"
  },
  time: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  published: Boolean,
  attendance:  {
    type:  Boolean,
    default: false,
    ref: "User"
  }
}, {timestamps: true});


const timeinModel = mongoose.model('Timein', timeinSchema, "Timein");

module.exports = timeinModel;
