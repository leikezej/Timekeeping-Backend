const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  name: String,
  age: Number,
  attendance: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }],
  timeIn: [{ type: Schema.Types.ObjectId, ref: 'TimeIn' }],
  timeout: [{ type: Schema.Types.ObjectId, ref: 'Timeout' }]
});

userSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

const timeInSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  isVerified: [{ type: Boolean, default: false }]
});

const timeoutSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  isVerified: [{ type: Boolean, default: false }]
});

const attendanceSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: [{ type: Boolean, default: false }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
const TimeIn = mongoose.model('TimeIn', timeInSchema);
const Timeout = mongoose.model('Timeout', timeoutSchema);
const User = mongoose.model('User', userSchema);


