const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, refreshToken: RefreshToken } = db;
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');
const sendEmail = require('../middleware/sendEmail');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
        try {
            const {email} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
},

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
      const {password} = req.body
      console.log(password)
      const passwordHash = await bcrypt.hash(password, 12)

      await Users.findOneAndUpdate({_id: req.user.id}, {
          password: passwordHash
      })

      res.json({msg: "Password successfully changed!"})
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
},


// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    res.send({ "status": "failed", "message": "Error" })
  } else {
    const salt = await bcrypt.genSalt(10)
    const newHashPassword = await bcrypt.hash(password, salt)
  }
} 