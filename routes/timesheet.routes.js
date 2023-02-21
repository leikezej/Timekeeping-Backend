const controller = require("../controllers/timesheet.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/timesheet/in", controller.createIn);
  
  app.put("/api/timesheet/:id", controller.update);
  
  app.get("/api/timesheet", controller.findAll);
  
  app.delete("/api/timesheet/:id", controller.delete);
  
//   app.get("/api/timein/:id", controller.findOne);
  
//   app.get("/api/timein/published", controller.findAllPublished);

};



