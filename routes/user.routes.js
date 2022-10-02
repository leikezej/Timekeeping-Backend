const { authJwt, checkUserAuth } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

       app.get("/api/test/all", controller.allAccess);

      app.use("/loggedUser", checkUserAuth);
      app.get('/loggeduser', controller.loggedUser);

      // app.use("/changepassword", checkUserAuth);
      // app.post("/changepassword", controller.changeUserPassword);

      // app.post("/send-reset-password-email", controller.sendUserPasswordResetEmail);
      // app.post("/reset-password/:id/:token", controller.userPasswordReset);
      // app.put("/api/auth/user/change-password/:id", controller.change);

      app.get("/api/auth/users", controller.getAllRecords);
      app.get("/api/auth/user/:id", controller.findOne);
      app.get("/api/auth/user/:email", controller.findEmail);
      app.put("/api/auth/user/:id", controller.update);
      app.delete("/api/auth/user/:id", controller.delete);
      app.delete("/api/auth/users", controller.deleteAll);
      
      
      app.post("/api/user/activateEmail", controller.activateEmail);
      app.post("/api/user/forgotPassword", controller.forgotPassword);
      app.post("/api/user/resetPassword", controller.resetPassword);
      app.post("/api/user/logoutUser", controller.logoutUser);
      
      
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