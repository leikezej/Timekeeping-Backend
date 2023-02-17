// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//   first_name: { type: String, required: true, maxLength: 100 },
//   family_name: { type: String, required: true, maxLength: 100 },
//   date_of_birth: { type: Date },
//   date_of_death: { type: Date },
// });


// UserSchema.virtual("name").get(function () {
//   let fullname = "";
//   if (this.first_name && this.family_name) {
//     fullname = `${this.family_name}, ${this.first_name}`;
//   }
//   if (!this.first_name || !this.family_name) {
//     fullname = "";
//   }
//   return fullname;
// });

// UserSchema.virtual("url").get(function () {
//   return `/auth/user/${this._id}`;
// });

// module.exports = mongoose.model("User", UserSchema);

// const leaveModel = mongoose.model("leave", leaveSchema, "Leave");
// module.exports = leaveModel;