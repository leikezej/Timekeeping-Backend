const db = require('../config/db.config.js');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// const env = require('../config/env.js');
 
const User = db.users;

// FETCH all Users
exports.findAll = (req, res) => {
  User.findAll().then(users => {
    // Send all users to Client
    res.send(users);
  });
 };
  
 // Find a User by Id
 exports.findById = (req, res) => { 
  User.findById(req.params.userId).then(user => {
  res.send(user);
  })
 };
  
 // Update a User
 exports.update = (req, res) => {
  const id = req.params.userId;
  User.update( { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email }, 
  { where: {id: req.params.userId} }
  ).then(() => {
  res.status(200).send({ message: 'updated successfully a user with id = ' + id });
  });
 };
  
 // Delete a User by Id
 exports.delete = (req, res) => {
  const id = req.params.userId;
  User.destroy({
    where: { id: id }
  }).then(() => {
    res.status(200).send({ message: 'deleted successfully a user with id = ' + id });
  });
 };
  
 exports.signup = (req, res) => {
  //Check Email
     User.findOne({
  where: {
    email: req.body.email
  }
    }).then(user => {
  if (user) {
    res.status(400).send({message: "Failed! Email is already in use!"});
  }else{
  //create User
  User.create({
  firstname: req.body.firstname,
  lastname: req.body.lastname,
  email: req.body.email,
  password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(user => {
  res.status(200).send({ message: "User was registered successfully!" });
  })
  .catch(err => {
  res.status(500).send({ message: err.message });
  });
  }
  }); 
   };
  
   exports.passwordReset (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required()});
        const {error} = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOneI({ email: req.body.email});
        if(!user) return res.status(400).send("user given does not exist");

        let token = await Token.findOneI({ user: "userId: user._id"});
        if(!token){
            token = await new Token ({
                userId: user._id,
                token: crypto.randomBytes(32).toString('hex'),
            }).save()
        }

        const link = `${process.env.BASE_URL}/passwordReset/${user._id}/${token.token}`;
        await sendEmail(user.email, "password reset", link);

        res.send("password reset link sent to your email")
    } catch (error) {
        res.send("An Error occured");
        console.log(error)
    }
};
  
   exports.signin = (req, res) => {
  User.findOne({
    where: {
  email: req.body.email
    }
  })
    .then(user => {
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }else{
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
  var token = jwt.sign({ id: user.id }, env.JWT_ENCRYPTION, {
  expiresIn:60 * 60 * 24 // 24 hours
  });
  
  res.status(200).send({
  id: user.id,
  email: user.email,
  accessToken: token
  });
  }
  
    })
    .catch(err => {
  res.status(500).send({ message: err.message });
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

