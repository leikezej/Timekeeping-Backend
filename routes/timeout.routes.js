const controller = require("../controllers/timeout.controller");

module.exports = function(app) {

  app.post("/api/user/timeout", controller.create);
  app.get("/api/user/timeout", controller.findAll);
  app.get("/api/user/timeout/:id", controller.findOne);
  app.put("/api/user/timeout/:id", controller.update);
  app.delete("/api/user/timeout/:id", controller.delete);
  app.delete("/api/user/timeout", controller.deleteAll);

};