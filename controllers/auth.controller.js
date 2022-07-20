const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

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
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          name: user.name,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
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
exports.reset = async (req, res) => {
  try {
      // const schema = Joi.object({ password: Joi.string().required() });
      const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

      const token = await token.findOne({
          userId: user._id,
          token: req.params.token,
      });
       if (!token) return res.status(400).send("Invalid link or expired");

      user.password = req.body.password;
        await user.save();
        await token.delete();

      res.send("password reset sucessfully.");
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
};





//SIGNOUT
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