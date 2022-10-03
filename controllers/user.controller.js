const db = require("../models");
const config = require("../config/auth.config");
const transporter = require("../config/email.config");
const Op = db.Sequelize.Op;
const { user: User, role: Role, roles: Roles, refreshToken: RefreshToken } = db;
const fileUpload = require("express-fileupload");
const ip = require('ip');


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
