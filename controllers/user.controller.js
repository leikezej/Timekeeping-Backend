const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, roles: Roles, refreshToken: RefreshToken } = db;



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
exports.logoutUser = async (req, res) => {
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

// ACTIVATE EMAIL
exports.activateEmail =  async (req, res) => {
    try {
        const {activation_token} = req.body
        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

        const {name, email, password} = user

        const check = await User.findOne({email})
        if(check) return res.status(400).json({msg:"This email already exists."})

        const newUser = new User({
            name, email, password
        })

        await newUser.save()

        res.json({msg: "Account has been activated!"})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},

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


// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
        try {
            const {tokenId} = req.body

            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
            
            const {email_verified, email, name, picture} = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
}

// FACEBOOK LOGIN
exports.facebookLogin = async (req, res) => {
        try {
            const {accessToken, userID} = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            
            const data = await fetch(URL).then(res => res.json()).then(res => {return res})

            const {email, name, picture} = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
}

// const createActivationToken = (payload) => {
//     return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
// }

// const createAccessToken = (payload) => {
//     return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
// }

// const createRefreshToken = (payload) => {
//     return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
// }










  // exports.changeUserPassword = async (req, res) => {
  //   const { password, password_confirmation } = req.body
  //   if (password && password_confirmation) {
  //     if (password !== password_confirmation) {
  //       res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
  //     } else {
  //       const salt = await bcrypt.genSalt(10)
  //       const newHashPassword = await bcrypt.hash(password, salt)
  //       await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
  //       res.send({ "status": "success", "message": "Password changed succesfully" })
  //     }
  //   } else {
  //     res.send({ "status": "failed", "message": "All Fields are Required" })
  //   }
  // }

  exports.loggedUser = async (req, res) => {
    res.send({ "user": req.user })
  }

  exports.sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await UserModel.findOne({ email: email })
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // // Send Email
        // let info = await transporter.sendMail({
        //   from: process.env.EMAIL_FROM,
        //   to: user.email,
        //   subject: "GeekShop - Password Reset Link",
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

  exports.userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body
    const { id, token } = req.params
    const user = await UserModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {
          const salt = await bcrypt.genSalt(10)
          const newHashPassword = await bcrypt.hash(password, salt)
          await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
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
  
  // SUBMIT OTP
module.exports.submitOtp = (req, res) => {
   console.log(req.body)
   
   UserModel.findOne({ otp: req.body.otp }).then(result => {
      // update password 
      
      // UserModel.updateOne({ email: result.email}, { otp: _otp })
      UserModel.updateOne({ email: result.email}, { password: req.body.password })
      .then(result => {
         res.send({ code: 200, message: 'Password Updated' })
      })
      .catch(error => {
         res.send({ code: 500, message: 'Something Went Wong!' })
      })
      
   }).catch(error => {
      
      res.send({ code: 500, message: 'Fuck ERROR!' }) 
   
   })
   
}

// SEND OTP
module.exports.sendOtp = async (req, res) => {
   console.log(req.body)
   
   // const _otp = Math.floor(Math.random * 1000000)
   const _otp = Math.floor(100000 + Math.random() * 900000)
   console.log(_otp)
   
   let user = await UserModel.findOne({email: req.body.email})
      if (!user) {
         res.send({ code: 500, message: 'User Not Found!' })
      }
   
   let testAccount = await nodemailer.createTestAccount()
   
   let transporter = nodemailer.createTransport({
      // sendmail: true,
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
         user: testAccount.user,
         pass: testAccount.pass
      }
   })
   
   // let transporter = nodemailer.createTransport({
   //    service: 'gmail',
   //    auth: { 
   //       user: '',
   //       password: 'haha123!'
   //    }
   // })
   
   let info = await transporter.sendMail({
      from: "jezedevkiel21@gmail.com",
      to: req.body.email, // Listat Mga Email Na Se Sendan
      subject: "OTP Generate",
      text: String(_otp),
      html: `<html>
            < body >
               Hello and Welcome
         </ >
         </html > `,
   })
   
   if(info.messageId){
      console.log(info, 84)

      UserModel.updateOne({ email: req.body.email}, { otp: _otp })
         .then(result => {
            res.send({ code: 200, message: 'OTP Sent' })
         })
         .catch(error => {
            res.send({ code: 500, message: 'Something Went Wong!' })
         })
         
      } else {
         
         res.send({ code: 500, message: 'Server Error'})
      }
}
   