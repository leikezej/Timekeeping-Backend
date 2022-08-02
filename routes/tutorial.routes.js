const controller = require("../controllers/tutorial.controller");

module.exports = function(app) {

  app.post("/api/tutorial", controller.create);
  app.get("/api/tutorial", controller.findAll);
  app.get("/api/tutorial/:id", controller.findOne);
  app.get("/api/tutorial/published", controller.findAllPublished);
  app.put("/api/tutorial/:id", controller.update);
  app.delete("/api/tutorial/:id", controller.delete);
  app.delete("/api/tutorial", controller.deleteAll);

};