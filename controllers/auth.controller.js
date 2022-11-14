const db = require("../models");
const config = require("../config/auth.config");

const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("../models");

// SIGNUP USER
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    name: req.body.name,
    image: req.body.image,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 10)
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
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1 admin, 3 moderator
        user.setRoles([222]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// REGISTER USER
exports.register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and Confirm Password do not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}

// SIGNIN USER
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ 
          STATUS: "Status 404",
          MESSAGE: "Email Not found",
          ERROR: "Error Email Incorrect"
        });
        console.log(404)
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
          // res.send(token)
        return res.status(401).send({
          // token: (token),
          // accessToken: null,
          status: "Status 401",
          message: "Invalid Password!",
          error: "Error Password Incorrect",
        });
      }
      
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });
      
  if (!user.email==="email" && user.password==="password") {
          res.send(accessToken)
          res.send(token)
        return res.status(502).send({ 
          STATUS: "Status 502",
          MESSAGE: "Wrong Email or Password",
          ERROR: "Error Email or Password"
        });
      console.log(502)
      }

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        
    req.session.token = token;

    req.session.token = token;
        res.status(200).send({
          status: 'OK',
          id: user.id,
          name: user.name,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken,
          expiryDate: config.jwtExpiration,
          // cookies: user.cookies,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message,
      // 'Error ->' + err
      });
    });
};

// LOGIN USER
exports.login = async (req, res) => {
      try {
        const user = await User.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await User.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"Email not found"});
    }
}

// LOGOUT USER
exports.logout = async (req, res) => {
    try {
    res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
     req.session = null;
    req.session.destroy();
    res.redirect("/");
      req.session = null;
      res.clearCookie('refreshtoken', 'accessToken')
      return res.json({message: "Successfully Logged out."})
  } catch (err) {
      return res.status(500).json({msg: err.message})
    this.next(err);
  }
},

// SIGNOUT USER
exports.signout = async (req, res) => {
    req.session.destroy();
         req.session = null;
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

// LOGOUTS USER
exports.logouts = async (req, res) => {
    // req.session.destroy();
    // req.session.null();
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await User.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await User.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

// user refresh token
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
      expiryDate: config.jwtExpiration
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.forgotPassword = async (req, res, next) => {
  let user = {
    id: '2',
    email: 'jezedevkiel21@gmail.com',
    password: "123123123"
  }
  const {email} = req.body;
  
  const secret = process.env.JWT_SECRET + user.password
  
  const payload = {
    email: user.email,
    id: user.id
  }
  
  const token = jwt.sign(payload, secret, {expiresIn: '15m'});
  const link = `http://localhost:272/api/auth/resets-password/${user.id}/${token}`;
  console.log(link);
     res.status(200).send({ 
        message: 'Password reset link has been sent to your Email', 
        resetlink: link });
};

exports.resetsPassword = async (req, res, next) => {
  const { id, token } = req.params;
  User.findByPk(id)
  
  if (id !== user.id) {
     res.status(200).send({ message: "NICE!" });
    return
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    const payload  = jwt.verify(token, secret)
    res.render('reset-password', {email: user.email})
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const {password, passwordConfirm} = req.body;

  if (id !== user.id) {
    // res.send('Invalid id...');
    res.send('Password Resetted');
    return;
  }
  
  const secret = process.env.JWT_SECRET + user.password
  
  try {
    const payload = jwt.verify(token, secret)
    
    user.password = password
    res.send(user)
    
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};