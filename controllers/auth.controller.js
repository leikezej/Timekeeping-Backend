const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var ip = require('ip');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// LOG USER 
exports.loggedUser =  (req, res) => {
    res.end("Your IP address is " + ip.address());
    res.send({ "user": req.users })
}

// REGISTER USER
exports.signup = (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    userIp: req.body.ip,
    userIp: ip,
    userIp: ip.address(),
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
            res.end("Your IP address is " + ip.address());
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
    res.end("Your IP address is " + ip.address());
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
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    
    if (!passwordIsValid) {
      return res.status(401).send({
        status: "failed",
        message: "Invalid Password!",
        userIP: "ip",
        userIPs: ip.address()
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
        name: user.name,
        email: user.email,
        image: user.image,
        role: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        userIp: getUserIp,
        expiryDate: config.jwtExpiration,
    });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  console.log(Success);
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
      expiryDate: config.jwtExpiration,
      userIp: getUserIp,
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};