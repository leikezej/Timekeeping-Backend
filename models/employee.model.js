const bcrypt = require  ('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ip = require('ip');


const employeeSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    avatar: {
        type: String
    }
    

});

const Employee = mongoose.model("Employee", employeeSchema,  "Employee");

module.exports = Employee;




// const mongoose = require('mongoose');

// const EmployeeSchema = new mongoose.Schema({
//   name: String,
//   address: String,
//   position: String,
//   salary: Number,
//   updated_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Employee', EmployeeSchema);