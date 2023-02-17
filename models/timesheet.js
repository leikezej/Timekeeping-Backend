// const MYDBSchema = new mongoose.Schema({
//     user: { type: mongoose.Types.ObjectId}, // Reference of User
//     dailyReport: { type: mongoose.Types.ObjectId}, // Reference of Daily Report
//     date: { type: Date }, // Start Of The Day Date . Example your offset -330 then store it as "2021-11-26T18:30:00.000Z"
//     inTime: { type: Date }, // Will have Clock In / Break In
//     outTime: { type: Date } // Will have Clock Out / Break Out
//     duration: { type: Number } // Will have Duration in Seconds difference between inTime and outTime
//     type: { type: Number } // Break or Work
// });