const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const { logger } = require('./middleware/logEvents');

const app = express();
const requestIp = require('request-ip');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");

var nodemailer = require('nodemailer');
var bcrypt = require("bcryptjs");
var randtoken = require('rand-token');

const path = require("path");
global.__basedir = __dirname;

//send email
function sendEmail(email, token) {
  var email = email;
  var token = token;
  var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'jezedevkiel21@gmail.com', // Your email id
    pass: 'Hahaha123!' // Your password
     }
    });
      var mailOptions = {
        // from: '[email protected]',
        from: 'jeze2kiel@pm.me',
        to: process.env.MAIL_FROM_ADDRESS,
        subject: 'Reset Password Link - Jepski.com',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:4000/reset-password?token=' + token + '">link</a> to reset your password</p>'
        };
      mail.sendMail(mailOptions, function(error, info) {
        if (error) {
        console.log(1)
      } else {
         console.log(0)
    }
  });
}

app.use(morgan('dev'));
app.use(logger);

var corsOptions = {
  origin: "http://localhost:3000"
  // origin: "*"
};

const db = require("./models");
const Role = db.role ;
const User = db.user;

app.use(express.static("files"));

app.use(cors(corsOptions));
app.use(logger);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());
app.use(
  cookieSession({
    name: "bugtech-session",
    secret: "process.env.SESSION_SECRET",
    httpOnly: false,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

//  db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
//  });

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/upload.routes')(app);
require('./routes/email.routes')(app);



const PORT = process.env.PORT || 0420;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
   Role.create({
     id: 0420,
     name: "user"
   });

   Role.create({
     id: 0230,
     name: "admin"
   });

  }