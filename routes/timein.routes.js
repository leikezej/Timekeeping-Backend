const controller = require("../controllers/timein.controller");

module.exports = function(app) {

  app.post("/api/user/timein", controller.create);
  app.get("/api/user/timein", controller.findAll);
  app.get("/api/user/timein/:id", controller.findOne);
  app.put("/api/user/timein/:id", controller.update);
  app.delete("/api/user/timein/:id", controller.delete);
  app.delete("/api/user/timein", controller.deleteAll);
  app.get("/api/user/timein/published", controller.findAllPublished);

};
