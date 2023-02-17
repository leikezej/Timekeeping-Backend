const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LeaveInstanceSchema = new Schema({
  id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "Approved", "Declined"],
    default: "Pending",
  },
  due_back: { type: Date, default: Date.now },
});

LeaveInstanceSchema.virtual("url").get(function () {
  return `/catalog/leaveinstance/${this._id}`;
});

module.exports = mongoose.model("LeaveInstance", LeaveInstanceSchema);