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