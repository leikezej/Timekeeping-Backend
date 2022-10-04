const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, roles: Role, refreshToken: RefreshToken } = db;
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');

var ip = require('ip');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// LOG USER 
// exports.loggedUser =  (req, res) => {
//     res.end("Your IP address is " + ip.address());
//     res.send({ "user": req.users })
// }

// REGISTER USER
exports.signup = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: 'User was registered with' + '${roles} '});
          });
        });
      } else {
        // user role = 1
        user.setRoles([0420]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// LOGIN USER
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ status: "failed", message: "User Not found." });
      console.log('status')
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
      );
      
      if (!passwordIsValid) {
        return res.status(401).send({
        status: "failed",
        message: "Invalid Password!",
        // userIPs: ip.address()
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let refreshToken = await RefreshToken.createToken(user);

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;
      return res.status(200).send({
        status: OK,
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        // userIp: getUserIp,
        expiryDate: config.jwtExpiration,
    });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  console.log(Success);
};

// VERIFY USER EMAIL
exports.verify = async (req, res) => {
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
    console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      // userIp: getUserIp,
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
      expiryDate: config.jwtExpiration,
    });
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// SIGNOUT USER
exports.signout = async (req, res) => {
      try {
        res.cookie('jwt', '', { maxAge: 1 });
        res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
        req.session = null;
        return res.status(200).send({
          message: "Logged Out Successful!"
        });
      } catch (err) {
        this.next(err);
    }
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
};

// LOGOUT USER
exports.logout = (req,res) => {
    req.session.destroy((err) =>{
      res.clearCookie('jwt');
       res.redirect('/');
       navigate('/');
    })
};

// LOGOUT
exports.logouts =  (req, res) => { 
    return res.json({ message: 'Logged out successfully' });
}

// RESET PASSWORD
exports.resetPassword = (req, res) => {
  const {resetLink, newPassword} = req.body;
  
  if(resetLink){
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function(error, decodedData) {
      if(error) {
        return res.status(401).json({
          error: "Incorrect Token or Expired  "
        })
      }
      User.findOne({resetLink}, (err, user) => {
        if(err || !user) {
            return res.status(401).json({error: "This Email Does Not Exist in our Database"});
        }
      })
    }) 
  } else {
    return res.status(401).json({ error: "Authentication Error!"});
  }
}

// CHANGE USER PASSWORD
// exports.changeUserPassword = async (req, res) => {
//   const { password, confirmPassword } = req.body;
//   if (password !== confirmPassword) {
//     res.send({ "status": "failed", "message": "Error" })
//   } else {
//     const salt = await bcrypt.genSalt(10)
//     const newHashPassword = await bcrypt.hash(password, salt)
//   }
// } 

// CHANGE USER PASSWORD
exports.changePassword = async (req, res) => {
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
};

// FORGOT PASSWORD
exports.forgotPassword = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Password Updated"
        });
      } else {
        res.send({
          message: "Cannot Reset, Email Not Found!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "error"
      });
    });
};

// SUBMIT OTP
exports.submitOtp = (req, res) => {
   console.log(req.body)
   UserModel.findOne({ otp: req.body.otp }).then(result => {
      
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
exports.sendOtp = async (req, res) => {
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
//    service: 'gmail',
      // host: process.env.HOST,
      // service: process.env.SERVICE,
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      }
   })
   
   let info = await transporter.sendMail({
      // from: process.env.USER,
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
};


// const bcrypt = require('bcryptjs');
// const mailgun = require('mailgun-js');
// const DOMAIN = process.env.DOMAIN_NAME;
// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
exports.forgotPass = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).render('forgotPassword', {
            message: 'All fields are mandatory!'
        })
    }

    const sql1 = 'SELECT * from users WHERE email = ?';
    db.query(sql1, [email], async (err, results) => {
        if (err) throw err;
        else {
            if (!results) {
                res.status(401).render('forgotPassword', {
                    message: "That email is not registered!"
                });
            }

            const token = jwt.sign({ _id: results[0].uid }, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m' });
            const data = {
                from: 'noreplyCMS@mail.com',
                to: email,
                subject: 'Reset Password Link',
                html: `<h2>Please click on given link to reset your password</h2>
                        <p>${process.env.URL}/user/resetpassword/${token}</p>
                `
            };

            const sql2 = 'UPDATE users SET resetLink = ? WHERE email = ?';
            db.query(sql2, [token, email], (err, success) => {
                if (err)
                    res.render('forgotPassword', { message: 'Error in resetLink' });
                else {
                    mg.messages().send(data, (err, body) => {
                        if (err) res.render('forgotPassword', { message: err });
                        else {
                            console.log('Email sent!');
                            console.log(body);
                            res.render('forgotPassword', { message: "Email Sent Successfully!" })
                        }
                    });
                }
            });
        }
    });
}

exports.resetPass = (req, res, next) => {
    const { resetLink, password, confirmPass } = req.body;

    if (password !== confirmPass) {
        // This should be handled by flashing a message!

        res.redirect(`/user/resetpassword/${resetLink}`);
    } else {
        if (resetLink) {
            jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (err, data) => {
                if (err) {
                    res.render('resetPassword', { message: "Token Expired" });
                } else {
                    const sql1 = 'SELECT * FROM users WHERE resetLink = ?';
                    db.query(sql1, [resetLink], async (err, results) => {
                        if (err || results.length === 0) {
                            res.render('resetPassword', { message: "Token Expired" });
                        } else {
                            let hashed = await bcrypt.hash(password, 8);

                            const sql2 = 'UPDATE users SET passwrd = ? WHERE resetLink = ?';
                            db.query(sql2, [hashed, resetLink], (errorData, retData) => {
                                if (errorData) {
                                    res.render('resetPassword', { message: errorData });
                                } else {
                                    // This is the success part!
                                    // Follow up : Disable the jwt token : same as logout
                                    res.redirect('/user/login');
                                }
                            })
                        }
                    });
                }

            })
        } else {
            res.render('resetPassword', { message: "Authentication Error!!" });
        }
    }
}




// RESET PASSWORD
// exports.reset = async (req, res) => {
//   try {
//       // const schema = Joi.object({ password: Joi.string().required() });
//       const { error } = schema.validate(req.body);
//         if (error) return res.status(400).send(error.details[0].message);

//       const user = await User.findById(req.params.user_id);
//         if (!user) return res.status(400).send("invalid link or expired");

//       const token = await token.findOne({
//           user_id: user._id,
//           token: req.params.token,
//       });
//        if (!token) return res.status(400).send("Invalid link or expired");

//       user.password = req.body.password;
//         await user.save();
//         await token.delete();

//       res.send("password reset sucessfully.");
//   } catch (error) {
//       res.send("An error occured");
//       console.log(error);
//   }
// };

// SIGNOUT

// SIGNOUT USER


// PASSWORD CHANGE
// exports.changePassword = async (req, res) => {
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
// };

// ACTIVATE EMAIL ACCOUNT 
// exports.activateAccount = (req, res) => {
//   const {token} = req.body;
//   if(token) {
//     jwt.verify.token, process.env.JWT_ACC_ACTIVATE, funtionc(err, decodedToken) {
//       if(err) {
//         return res.status(400).json({ error: 'Incorrect or Expired Link'})
//       }
//       const { name, email, password } = decodedToken;
//       User.findOne({email}).exec((err, user) => {
//         if(user) {
//           return res.status(400).json({ error: 'User Email Exists'});
//         }
//         let newUser = new User({ name, email, password});
//         newUser.save((err, success) => {
//           if(err) {
//             console.log("Error", err);
//             return res.status(400).json({ error: 'Error activating'})
//           }
//           res.json({
//             message: "Signup Success"
//           })
//         })
//       });
//     })
// } else {
//   return res.json({error: "Something went wong!"})
//   }
// }