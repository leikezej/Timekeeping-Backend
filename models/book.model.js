const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TimeinSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

TimeinSchema.virtual("url").get(function () {
  return `/add/timein/${this._id}`;
});

module.exports = mongoose.model("Timein", TimeinSchema);