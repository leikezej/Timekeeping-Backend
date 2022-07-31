const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// REGISTER
exports.signup = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    address: req.body.address,
    phone: req.body.phone,
    role: req.body.role,
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
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// LOGIN
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
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
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      image: user.image,
      role: authorities,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  console.log("Success")
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
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.passwordReset = async (req, res) => {
  try {
      const schema = Joi.object({ email: Joi.string().email().required()});
      const {error} = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findOneI({ email: req.body.email});
      if(!user) return res.status(400).send("user given does not exist");

      let token = await token.findOneI({ user: "userId: user._id"});
      if(!token){
          token = await new token ({
              userId: user._id,
              token: crypto.randomBytes(32).toString('hex'),
          }).save()
      }

      const link = `localhost:3000/api/auth/passwordReset/${user._id}/${token.token}`;
      await sendEmail(user.email, "password reset", link);

      res.send("password reset link sent to your email")
  } catch (error) {
      res.send("An Error occured");
      console.log(error)
  }
};


// FORGOT PASSWORD
exports.forgot = async (req, res) => {
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

// exports.reset = async (req, res) => {
//   const id = req.params.id;
//   User.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Password Updated"
//         });
//       } else {
//         res.send({
//           message: "Cannot Reset, Email Not Found!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "error"
//       });
//     });
// };
// RESET PASSWORD
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
  
//   User.findOne({email}, (err, user) => {
//     if(err || !user) {
//       return res.status(400).json({ error: "Email Does Not Exist!"});
//     }

//     // const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, { expiresIn: '20m'});
//     // const data = {
//     //     from: 'noreply@proton.com',
//     //     to: email,
//     //     subject: 'Account Activation Link',
//     //     html: `
//     //       <h2>Please Click The Link To Reset Your Password!</h2>      
//     //       <p>${process.env.CLIENT_URL}/api/auth/forgotpassword/${token}</p>
//     //     `
//     // };
//     tranEmailApi
//     .sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: 'Password Reset',
//         textContent: `
          
//         `,
//         htmlContent: `
//           <h1>Click Here To Reset Your Password</h1>
//           <a href="https://localhost:8080/api/auth/forgotPassword">Forgot Password</a>
//                 `,
//             params: {
//                 role: 'Reset',
//             },
//     })
//     .then(console.log)
//     .catch(console.log)

//     const sender = {
//       email: 'jezedevkiel21@gmail.com',
//       name: 'Jepski-Auth',
//     };
//     const receivers = [
//       {
//           email: email,
//       },
//   ]

//     return user.updateOne({ resetLink: token}, function (err, success) {
//       if(err) {
//         return res.status(400).json({ error: "Reset Password Link Error!"});
//       } else {
//         mg.messages().send(data, function (error, body) {
//           if(error) {
//             return res.json({
//                 error: message
//             })
//           }
//           return res.json({ message: 'Email has been sent!'});
//         });
//       }
//     })
//   })
// };

// SIGNOUT
exports.signout = async (req, res) => {
      try {
        req.session = null;
        return res.status(200).send({
          message: "Logged Out Successful!"
        });
      } catch (err) {
        this.next(err);
    }
};

// ACTIVATE ACCOUNT
// exports.activateAccount = async (req, res) => {
//   const {token} = req.body;

//   if(token) {
//     jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err, decodedToken){
//       if(err) {
//           return res.status(400).json({error: 'Incorrect or Expired Link'})
//       }

//       const { name, email, passsword } = decodedToken;

//       User.findOne({email}).exec((err, user) => {
//         if(user) {
//           return res.status(400).json({error: 'User With This Email Already Exists!'});
//         }
//         let newUser = new User({ name, email, password });
//         newUser.save((err, success) => {
//           if(err) {
//           console.log("Error");
//           return res.status(400).json({error: 'Error Activating Account!'});
//         }
//         res.json({
//           message: "Signup Success!"
//         })
//       })
//     });
//   })
// } else {
//     return res.json({ Error: "Something went Strong!"})
//   }
// }