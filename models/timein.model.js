const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeinSchema = Schema({
  // id: { type: Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String,
  },
  time: {
    type: String,
    default: Date.now(),
    // default: new Date()
  },
  date: {
    type: Date,
    default: Date.now()
  },
  attendance:  {
    type:  Boolean,
    default: false,
    ref: "User"
  }
});


const Timein = mongoose.model('Timein', timeinSchema, "Timein");




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