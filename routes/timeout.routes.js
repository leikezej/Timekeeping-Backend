const controller = require("../controllers/timeout.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/timeout/create", controller.create);
  
  app.get("/api/timeout/findAll", controller.findAll);
  
  app.get("/api/timeout/:id", controller.findOne);
  
  app.put("/api/timeout/:id", controller.update);
  
  app.delete("/api/timeout/:id", controller.delete);
  
  app.get("/api/timeout/published", controller.findAllPublished);

};



