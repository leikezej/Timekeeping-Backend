const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/timeout.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/timeout/create", controller.create);
  app.get("/api/user/timeout", controller.findAll);
  app.get("/api/user/timeout/:id", controller.findOne);
  app.put("/api/user/timeout/:id", controller.update);
  app.delete("/api/user/timeout/:id", controller.delete);
  app.delete("/api/user/timeout", controller.deleteAll);
  app.get("/api/user/timeout/published", controller.findAllPublished);

};



