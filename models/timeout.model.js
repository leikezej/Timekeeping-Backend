const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeoutSchema = new Schema({
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


const timeoutModel = mongoose.model('Timeout', timeoutSchema, "Timeout");

module.exports = timeoutModel;



// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const TimeinSchema = new Schema({
//   title: { type: String, required: true },
//   author: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   summary: { type: String, required: true },
//   isbn: { type: String, required: true },
//   genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
// });


// module.exports = mongoose.model("Timein", TimeinSchema);