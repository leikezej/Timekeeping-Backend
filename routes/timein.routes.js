const controller = require("../controllers/timein.controller");

module.exports = function(app) {

  app.post("/api/user/timein", controller.create);
  app.get("/api/user/timein", controller.findAll);
  app.get("/api/user/timein/:id", controller.findOne);
  app.get("/api/user/timein/published", controller.findAllPublished);
  app.put("/api/user/timein/:id", controller.update);
  app.delete("/api/user/timein/:id", controller.delete);
  app.delete("/api/user/timein", controller.deleteAll);

};

// const { authJwt } = require("../middleware");
// const controller = require("../controllers/timein.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post("/api/timesheet/timein", controller.timein);
// };