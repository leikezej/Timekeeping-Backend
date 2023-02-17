const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  attendance: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }]
});

const attendanceSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: [{ type: Boolean, default: false }]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
const User = mongoose.model('User', userSchema);