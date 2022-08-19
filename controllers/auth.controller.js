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
        // fullname: user.fullname,
        name: user.name,
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
exports.signout = async (req, res) => {
      try {
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