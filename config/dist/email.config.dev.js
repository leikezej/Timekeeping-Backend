"use strict";

var nodemailer = require('nodemailer');

var dotenv = require('dotenv');

dotenv.config(); // require('dotenv/config');

module.exports = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
}; // const { FaRegPaperPlane } = require('react-icons/fa');
// require('dotenv/config');
// module.exports = {
//    MAILER: process.env.MAIL_MAILER,
//    HOST: process.env.MAIL_HOST,
//    PORT: process.env.MAIL_PORT,
//    USERNAME: process.env.MAIL_USERNAME,
//    PASSWORD: process.env.MAIL_PASSWORD,
//    ENCRYPTION: process.env.MAIL_ENCRYPTION,
//    FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
//    FROM_NAME: process.env.MAIL_FROM_NAME
// }
// const nodemailer  = require('nodemailer');
// // dotenv.config()
// module.exports = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: 'jezedevkiel21@gmail.com', // Admin Gmail ID
//     pass: 'DevJeps420230!@!', // Admin Gmail Password
//   },
// }