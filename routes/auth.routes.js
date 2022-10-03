const { verifySignUp, userLogger } = require("../middleware");
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
      verifySignUp.checkRolesExisted,
      userLogger.getUserIp
    ],
    controller.signup
  );
  
  app.post("/api/auth/signin", 
      [
        // userLogger.getUserIp,
        userLogger.getLoggedUser
      ],
  controller.signin);
  
  app.get("/api/auth/loggedUser", controller.loggedUser);
  
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/logout", controller.logout);
  app.post("/api/auth/logouts", controller.logouts);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  
};