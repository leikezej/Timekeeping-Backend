const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const authorSchema = Schema({
  name: String,
  stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: "Author" },
  title: String,
});

const Story = mongoose.model("Story", storySchema);
const Author = mongoose.model("Author", authorSchema);


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
// const MYDBSchema = new mongoose.Schema({
//     user: { type: mongoose.Types.ObjectId}, // Reference of User
//     dailyReport: { type: mongoose.Types.ObjectId}, // Reference of Daily Report
//     date: { type: Date }, // Start Of The Day Date . Example your offset -330 then store it as "2021-11-26T18:30:00.000Z"
//     inTime: { type: Date }, // Will have Clock In / Break In
//     outTime: { type: Date } // Will have Clock Out / Break Out
//     duration: { type: Number } // Will have Duration in Seconds difference between inTime and outTime
//     type: { type: Number } // Break or Work
// });

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

// const MYDBSchema = new mongoose.Schema({
//     user: { type: mongoose.Types.ObjectId}, // Reference of User
//     dailyReport: { type: mongoose.Types.ObjectId}, // Reference of Daily Report
//     date: { type: Date }, // Start Of The Day Date . Example your offset -330 then store it as "2021-11-26T18:30:00.000Z"
//     inTime: { type: Date }, // Will have Clock In / Break In
//     outTime: { type: Date } // Will have Clock Out / Break Out
//     duration: { type: Number } // Will have Duration in Seconds difference between inTime and outTime
//     type: { type: Number } // Break or Work
// });

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