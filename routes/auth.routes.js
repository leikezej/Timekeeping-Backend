const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateNameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/loggedUser", controller.loggedUser);
  
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/logout", controller.logout);
  app.post("/api/auth/logouts", controller.logouts);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  
  app.post("/api/auth/forgotPassword", controller.forgotPassword);
  app.post("/api/auth/resetPassword", controller.resetPassword);
  
  app.post("/api/auth/submitOtp", controller.submitOtp);
  app.post("/api/auth/sendOtp", controller.sendOtp);
  
  app.post("/api/auth/changeUserPassword", controller.changeUserPassword);
  
  app.post('/api/auth/send-otp', controller.sendOtp)
  app.post('/api/auth/submit-otp', controller.submitOtp)
  
  
  app.post('/api/auth/reset-password-email', controller.resetPasswordEmail)
  app.post('/api/auth/update-password', controller.updatePassword)
  
  
};