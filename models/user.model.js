const bcrypt = require  ('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ip = require('ip');


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    present: {
      type: Boolean,
      default: false
    },
    roles: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type: Schema.Types.ObjectId,
        enum: ['employee', 'admin', 'moderator'],
        default: "employee",
        ref: "Role",
      }
    ],
    attendance:[{
      date:{
          type:Date,
          default:Date.now,
      },
      entry:{type:Date}
  }],
  ip: {
    type: String,
    default: ip.address()
    },
      attendance: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }]
},  {timestamps: true})

const attendanceSchema = Schema({
  id: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isVerified: [{ type: Boolean, default: false }]
});

const attendanceModel = mongoose.model('attendance', attendanceSchema,  'Attendance');
const userModel = mongoose.model("user", userSchema, "User");

module.exports = userModel, attendanceModel;