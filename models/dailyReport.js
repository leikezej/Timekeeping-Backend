// TIMEIN
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const timeinSchema = new Schema({
//   name: {
//     type: String,
//     ref: "User"
//   },
//   time: {
//     type: String,
//   },
//   date: {
//     type: Date,
//     default: Date.now()
//   },
//   published: Boolean,
//   attendance:  {
//     type:  Boolean,
//     default: false,
//     ref: "User"
//   }
// }, {timestamps: true});


// const timeinModel = mongoose.model('Timein', timeinSchema, "Timein");

// module.exports = timeinModel;


//TIMEOUT
// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const timeoutSchema = new Schema({
//   name: {
//     type: String,
//     ref: "User"
//   },
//   time: {
//     type: String,
//   },
//   date: {
//     type: Date,
//     default: Date.now()
//   },
//   published: Boolean,
//   attendance:  {
//     type:  Boolean,
//     default: false,
//     ref: "User"
//   }
// }, {timestamps: true});


// const timeoutModel = mongoose.model('Timeout', timeoutSchema, "Timeout");

// module.exports = timeoutModel;


// LOAN SCHEMA
// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const loanSchema = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });

// const Loan = mongoose.model('Loan', loanSchema);

// const MYDBSchema = new mongoose.Schema({
//     user: { type: mongoose.Types.ObjectId}, // Reference of User
//     shift: { type: mongoose.Types.ObjectId}, // Reference of User
//     date: { type: Date }, // Start Of The Day Date . Example your offset -330 then store it as "2021-11-26T18:30:00.000Z"
//     lateIn: { type: Number, default: 0 }, //  Will have total LAte In Seconds
//     earlyOut: { type: Number, default: 0}, // Will have total Early Out Seconds
//     overTime: { type: Number } // Will have Overtime
//     breakTime: { type: Number } // Will have total Break Time
//     initialInTime: { type: Date }, // Will have First Clock In
//     finalOutTime: { type: Date } // Will have Final Clock Out
//     totalWorkHour: { type: Number } // Will have Total Working Hour Seconds
//     dayStatus: { type: Number } // Will define that day is Holiday or Weekend or Working Day
//     timeStatus: { type:  Number } // Will have initial (absent), work (working), break (on break), end (Clocked Out),
// });


// SHIFT

// const MYDBSchema = new mongoose.Schema({
//     name: { type: String, default: 'Default' },
//     weekend: { type: Array, default: [] },
//     time: {type: Array, default: [] },
//     lateIn: { type: Number, default: 0 },
//     earlyOut: { type: Number, default: 0},
//     halfDayHour: { type: Number }, // Half Day
//     fullDayHour: { type: Number } // Full Day
//     offset: { type: Number } // Timezone offset
//     assignedEmployee: { type: Array, default: [] }
// });

// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const TimeinSchema = Schema({
//   time: String,
//   stories: [{ type: Schema.Types.ObjectId, ref: "Timeout" }],
// });

// const TimeoutSchema = Schema({
//   time: { type: Schema.Types.ObjectId, ref: "Timein" },
//   title: String,
// });

// const AttendanceSchema = Schema({
//   name: { type: Schema.Types.ObjectId, ref: "User" },
//   title: String,
// });

// const Timein = mongoose.model("Timein", TimeinSchema);
// const Timeout = mongoose.model("Timeout", TimeoutSchema);
// const Attendance = mongoose.model("Attendance", AttendanceSchema);

// module.exports = { Timein, Timeout, Attendance};

