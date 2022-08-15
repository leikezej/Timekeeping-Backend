const { authJwt } = require("../middleware");
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

      //app.use("/loggedUser", authJwt.verifyToken, contoller.oggedUser);

      app.get("/api/auth/users", controller.findAll);
      app.get("/api/auth/user/:id", controller.findOne);
      app.get("/api/auth/user/:email", controller.findOne);
      app.put("/api/auth/user/:id", controller.update);
      app.delete("/api/auth/user/:id", controller.delete);
      app.delete("/api/auth/users", controller.deleteAll);
      

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