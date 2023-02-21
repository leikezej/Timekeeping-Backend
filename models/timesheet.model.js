const { compareAsc, format } = require ('date-fns');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const timesheetSchema = new Schema({
  name: {
    type: String,
    ref: "User"
  },
  // timeStart: {
  //   type: Date,
  //   default: Date.now
  // },
  timeStart: {
    type: String,
    default: Date.now
  },
  timeEnd: {
    type: String,
    default: Date.now()
  },
  totalHours:  {
    type: Number,
    default: function(){
      return this.timeStart + this.timeEnd
    }
  },
}, {timestamps: true });

// }, {timestamps: {currentTime: () => Math.floor(Date.now() / 1000) }});

// // Generate and hash password token
// UserSchema.methods.getResetPasswordToken = function() {
//   // Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex');
// // Hash token and set to resetPasswordToken field
//   this.resetPasswordToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');
// // Set expire
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };

// //Match input password with encrypted password
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const timesheetModel = mongoose.model('Timesheet', timesheetSchema, "Timesheet");
module.exports = timesheetModel;
