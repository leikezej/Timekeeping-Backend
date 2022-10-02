const db = require("../models");
const config = require("../config/auth.config");
const transporter = require("../config/email.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, roles: Roles, refreshToken: RefreshToken } = db;
const fileUpload = require("express-fileupload");


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


// UPLOAD PROFILE
exports.uploadProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
  
    if (!user) {
      return res.status(404).json({ message: "Resource not found" });
    }
    const profile = req.files.profile;
    const fileSize = profile.size / 1000;
    const fileExt = profile.name.split(".")[1];
    if (fileSize > 500) {
      return res
        .status(400)
        .json({ message: "file size must be lower than 500kb" });
    }

    if (!["jpg", "png"].includes(fileExt)) {
      return res
        .status(400)
        .json({ message: "file extension must be jpg or png" });
    }

    const fileName = `${req.params.id}${path.extname(profile.name)}`;
    profile.mv(`/uploads/${fileName}`, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      await User.findByIdAndUpdate(req.params.id, { profile: fileName });
      res.status(200).json({
        data: {
          file: `${req.protocol}://${req.get("host")}/${fileName}`,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
