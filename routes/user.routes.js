const {User, validate} = require("../models/user.model");
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
// const auth = require('../middleware/auth.js');
// const router = express.Router();


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
      // "Authorization, Bearer + Token"
    );
    next();
  });


  // //send email
  //   function sendEmail(email, token) {
  //     var email = email;
  //     var token = token;
  //     var mail = nodemailer.createTransport({
  //       service: 'gmail',
  //         auth: {
  //          user: 'jezedevkiel21@gmail.com', 
  //          pass: 'DevJeps420230!@!' // Your password
  //       }
  //     });

  //     var mailOptions = {
  //       from: 'noreply@gmail.com',
  //       to: email,
  //       subject: 'Reset Password Link - Jepski.com',
  //       html: '<p>You requested for reset password, kindly use this <a href="http://localhost:8080/api/auth/reset?token=' + token + '">link</a> to reset your password</p>'
  //     };

  //     mail.sendMail(mailOptions, function(error, info) {
  //     if (error) {
  //      console.log(1)
  //     } else {
  //       console.log(0)
  //          }
  //       });
  //     }
    
  //   /* send reset password link in email */
  //     app.post('/api/auth/reset', function(req, res, next) {
  //     var email = req.body.email;
  //     //console.log(sendEmail(email, fullUrl));
  //     connection.query('SELECT * FROM users WHERE email ="' + email + '"', function(err, result) {
  //     if (err) throw err;
  //     var type = ''
  //     var msg = ''
  //     console.log(result[0]);
  //     if (result[0].email.length > 0) {
  //     var token = randtoken.generate(20);
  //     var sent = sendEmail(email, token);
  //     if (sent != '0') {
  //     var data = {
  //     token: token
  //     }
  //     connection.query('UPDATE users SET ? WHERE email ="' + email + '"', data, function(err, result) {
  //     if(err) throw err
  //     })
  //     type = 'success';
  //     msg = 'The reset password link has been sent to your email address';
  //     } else {
  //     type = 'error';
  //     msg = 'Something goes to wrong. Please try again';
  //     }
  //     } else {
  //     console.log('2');
  //     type = 'error';
  //     msg = 'The Email is not registered with us';
  //     }
  //     req.flash(type, msg);
  //     res.redirect('/');
  //     });
  //     })

// /* reset page */
//       router.get('/api/auth/reset-password', function(req, res, next) {
//         res.render('reset-password', {
//         title: 'Reset Password Page',
//         token: req.query.token
//         });
//         });

//   /* update password to database */
//       router.post('/api/auth/update-password', function(req, res, next) {
//       var token = req.body.token;
//       var password = req.body.password;
//       connection.query('SELECT * FROM users WHERE token ="' + token + '"', function(err, result) {
//       if (err) throw err;
//       var type
//       var msg
//       if (result.length > 0) {
//       var saltRounds = 10;
//       // var hash = bcrypt.hash(password, saltRounds);
//       bcrypt.genSalt(saltRounds, function(err, salt) {
//       bcrypt.hash(password, salt, function(err, hash) {
//       var data = {
//       password: hash
//       }
//       connection.query('UPDATE users SET ? WHERE email ="' + result[0].email + '"', data, function(err, result) {
//       if(err) throw err
//       });
//       });
//       });
//       type = 'success';
//       msg = 'Your password has been updated successfully';
//       } else {
//       console.log('2');
//       type = 'success';
//       msg = 'Invalid link; please try again';
//       }
//       req.flash(type, msg);
//       res.redirect('/');
//       });
//       })
    


      // // Retrieve all User
      // app.get('/api/auth/users',auth, users.findAll);
 
      // // Retrieve a single User by Id
      // app.get('/api/auth/users/:userId', users.findById);
   
      // // Update a User with Id
      // app.put('/api/auth/users/:userId',auth, users.update);
   
      // // Delete a User with Id
      // app.delete('/api/auth/users/:userId',auth, users.delete);
   
      // // User signup
      // app.post('/api/auth/signup', users.signup);
      
      // // User signin
      // app.post('/api/auth/signin', users.signin);

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  
};