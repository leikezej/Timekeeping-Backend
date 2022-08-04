const controller = require("../controllers/timein.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/timeIn", timein.create);
//   app.get("/api/user/timeIn", controller.timeIn);

//   app.get("/api/user/timeOut", controller.timeOut);

};