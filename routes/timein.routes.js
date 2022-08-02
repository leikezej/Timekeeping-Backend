const { authJwt } = require("../middleware");
const controller = require("../controllers/timein.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/timesheet", controller.timeSheet);
  app.post("/api/timesheet/timein", authJwt.verifyToken, controller.timein);
};