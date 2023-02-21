const bcrypt = require  ('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ip = require('ip');

const userSchema = new Schema({
  fullname: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String
  },
    email: {
      type: String,
      trim: true,
      required: [true, "Please Provide Email Address"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please Provide A Valid Email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please Add A Password"],
      minlength: 8,
    },
    salary: {
      type: String
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // type: Schema.Types.ObjectId,
        enum: ["employe", "admin", "moderator"],
        default: "employee",
        ref: "Role",
      }
    ],
  //   attendance:[{
  //     date:{
  //         type:Date,
  //         default:Date.now,
  //     },
  //     entry:{type:Date}
  // }],
  ip: {
    type: String,
    default: ip.address()
    },
    // city: String,
      attendance: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }]
},  {timestamps: true})

// const attendanceSchema = Schema({
//   id: { type: Schema.Types.ObjectId, ref: 'User' },
//   title: String,
//   present: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//   isVerified: [{ type: Boolean, default: false }]
// });

// const attendanceModel = mongoose.model('attendance', attendanceSchema,  'Attendance');
// const userModel = mongoose.model("user", userSchema, "User");
const userModel = mongoose.model('user', userSchema,  'User');


module.exports = userModel;