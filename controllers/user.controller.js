const db = require("../models");
const config = require("../config/auth.config");
const transporter = require("../config/email.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, roles: Roles, refreshToken: RefreshToken } = db;
const fileUpload = require("express-fileupload");

var ip = require('ip');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// GET IP
exports.getIp = (req, res) => {
  res.end("Your IP address is " + ip.address());
}

// GET ALL RECORDS
exports.getAllRecords = async (req, res) => {
  console.log('Sulod')
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(doc => {
      res.send(doc);
 
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ message: err.message });
    });
};


// LOGOUT USER
exports.logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
        return res.json({msg: "Logged out."})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},

// GET USER BY EMAIL
exports.findEmail = (req, res) => {
  const email = req.params.email;
    User.findAll(email)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with ${email}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with email=" + email
      });
    });
}

// FIND BY ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
}

// UPDATE USER
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// DELETE USER BY ID
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// DELETE ALL USER
exports.deleteAll = (req, res) => {
  User.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all Users."
        });
      });
};

// CHANGE USER PASSWORD
exports.changeUserPassword = async (req, res) => {
  const { password, password_confirmation } = req.body
  if (password && password_confirmation) {
    if (password !== password_confirmation) {
      res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
    } else {
      const salt = await bcrypt.genSalt(10)
      const newHashPassword = await bcrypt.hash(password, salt)
      await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
      res.send({ "status": "success", "message": "Password changed succesfully" })
    }
  } else {
    res.send({ "status": "failed", "message": "All Fields are Required" })
  }
}

// SEND RESET EMAIL LILNK
exports.sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body
  if (email) {
    const user = await User.findOne({ email: email })
    if (user) {
      const secret = user._id + process.env.RESET_PASSWORD_KEY
      const token = jwt.sign({ user_id: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // let info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: user.email,
        //   subject: "Jepski - Password Reset Link",
        //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
        // })
        res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
    } else {
      res.send({ "status": "failed", "message": "Email doesn't exists" })
    }
  } else {
    res.send({ "status": "failed", "message": "Email Field is Required" })
  }
}

// USER PASSWORD RESET
exports. userPasswordReset = async (req, res) => {

  const { password, password_confirmation } = req.body
  const { id, token } = req.params
  
  const user = await User.findByPk(id)
  const new_secret = user._id + process.env.JWT_SECRET_KEY
    
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          // await User.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
          await User.findOne(user._id, { $set: { password: newHashPassword } })
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
}


exports.allAccess = (req, res) => {
   res.status(200).send("Public Content.");
};
 
exports.userBoard = (req, res) => {
   res.status(200).send("User Content.");
};
 
exports.adminBoard = (req, res) => {
   res.status(200).send("Admin Content.");
};

exports.loggedUser = (req, res) => {
  //res.send({ "user": req.user })
  res.status(200).send({ "user": req.user })
}
