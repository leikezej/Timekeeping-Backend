"use strict";

var _require = require("../middleware"),
    authJwt = _require.authJwt,
    checkUserAuth = _require.checkUserAuth;

var controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", 'Access-Control-Allow-Origin: *', "x-access-token, Origin, Content-Type, Accept");
    next();
  });
  app.get("/api/test/all", controller.allAccess);
  app.use('/loggeduser', checkUserAuth);
  app.get('/getIp', controller.getIp);
  app.get("/api/users", controller.getAllRecords);
  app.get("/api/user/:id", controller.findOne);
  app.get("/api/user/:email", controller.findEmail);
  app.put("/api/user/:id", controller.update);
  app["delete"]("/api/user/:id", controller["delete"]);
  app["delete"]("/api/users", controller.deleteAll);
  app.post("/api/user/logoutUser", controller.logoutUser);
  "/api/test/user", [authJwt.verifyToken], controller.userBoard;
  app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};