const controller = require("../controllers/email.controller");

module.exports = function(app) {
    
  app.use(function(req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    app.post("/user/:email", controller.sendPasswordResetEmail)
    app.post("/receive_new_password/:userId/:token", controller.receiveNewPassword)


    // app.post("/reset_password", controller.resetPassword)
    app.post("/change_Password", controller.changePassword)

};