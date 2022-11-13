const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const refreshToken = require("../controllers/refreshToken.controller");
const { verifyToken } = require("../middleware/verifyToken");
// const { refreshToken } = require("../middleware/refreshToken");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
      app.get("/api/auth/users", controller.findAll);
      app.get("/api/auth/user/:id", controller.findOne);
      // app.get("/api/auth/user/:email", controller.findEmail);
      app.put("/api/auth/user/:id", controller.update);
      app.delete("/api/auth/user/:id", controller.delete);
      app.delete("/api/auth/users", controller.deleteAll);
      
      
      // app.get("/api/auth/v1/users", verifyToken,  controller.getUsers);
      // app.get("/api/auth/v1/token", controller.refreshToken);
  
  
  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userContent
  );

  app.get(
    // "/api/test/mod",
    "/api/test/pm",
    [authJwt.verifyToken, 
    // authJwt.isModerator],
    authJwt.isModeratorOrAdmin],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
