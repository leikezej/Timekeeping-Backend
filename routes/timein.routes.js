const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/timein.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/user/timein", controller.findAll);
  app.get("/api/user/timein/:id", controller.findOne);
  app.put("/api/user/timein/:id", controller.update);
  app.delete("/api/user/timein/:id", controller.delete);
  app.delete("/api/user/timein", controller.deleteAll);
  app.get("/api/user/timein/published", controller.findAllPublished);

};



