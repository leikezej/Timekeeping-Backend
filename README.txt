app.get('/', function(req, res){
  // check if the username is set in the session
  if (!req.session.username) {
    // redirect it to login page
    res.redirect('/login');
  } else {
    // do something
  }
});

app.post('/login', function(req, res) {
    // you would check check the username & password here
    // if (username == '...' /&& password ...)

    // set the username in the session session 
    req.session.username = username; 
});





     const MYDBSchema = new mongoose.Schema({
        user: { type: mongoose.Types.ObjectId}, // Reference of User
        shift: { type: mongoose.Types.ObjectId}, // Reference of User
        date: { type: Date }, // Start Of The Day Date . Example your offset -330 then store it as "2021-11-26T18:30:00.000Z"
        lateIn: { type: Number, default: 0 }, //  Will have total LAte In Seconds
        earlyOut: { type: Number, default: 0}, // Will have total Early Out Seconds
        overTime: { type: Number } // Will have Overtime
        breakTime: { type: Number } // Will have total Break Time
        initialInTime: { type: Date }, // Will have First Clock In
        finalOutTime: { type: Date } // Will have Final Clock Out
        totalWorkHour: { type: Number } // Will have Total Working Hour Seconds
        dayStatus: { type: Number } // Will define that day is Holiday or Weekend or Working Day
        timeStatus: { type:  Number } // Will have initial (absent), work (working), break (on break), end (Clocked Out),
});



const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    reason: {
        type: String
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    leave_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending"
    }

}, {timestamps: true})


const leaveModel = mongoose.model("leave", leaveSchema, "Leave");
module.exports = leaveModel;



const MYDBSchema = new mongoose.Schema({
    firstname: { type: String, default: 'default firstname' },
    lastname: { type: String, default: 'default lastname' },
    password: {type: String, default: 'pass' },
    email: { type: String, default: 'hahaha' },
    phone: { type: Number},
    dob: { type: Date },

    attendance:[{
        date:{
            type:Date,
            default:Date.now,
        },
        entry:{type:Date}


    }]
});