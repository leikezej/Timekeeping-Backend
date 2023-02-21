const controller = require("../controllers/timein.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/timein/create", controller.create);
  
  app.get("/api/timein/findAll", controller.findAll);
  
  app.get("/api/timein/:id", controller.findOne);
  
  app.put("/api/timein/:id", controller.update);
  
  app.delete("/api/timein/:id", controller.delete);
  
  app.get("/api/timein/published", controller.findAllPublished);

};



