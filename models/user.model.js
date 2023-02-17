const bcrypt = require  ('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type: Schema.Types.ObjectId,
        enum: ['employee', 'admin', 'moderator'],
        default: "employee",
        ref: "Role",
      }
    ]
},  {timestamps: true})

const userModel = mongoose.model("user", userSchema, "User");
module.exports = userModel;