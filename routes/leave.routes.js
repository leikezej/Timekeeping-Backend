const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/leave.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/apply-leave", controller.requestLeave);

  app.put("/api/leave-status", controller.statusLeave);

};