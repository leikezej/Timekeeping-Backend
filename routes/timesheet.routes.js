const controller = require("../controllers/timesheet.controller");

module.exports = function(app) {

  app.post("/api/user/timesheet", controller.new);
  app.get("/api/user/timesheets", controller.getAll);
  app.get("/api/user/timesheet/:id", controller.findSheet);
  app.put("/api/user/timesheet/:id", controller.updateSheet);
  app.delete("/api/user/timesheet/:id", controller.deleteSheet);
  app.delete("/api/user/timesheets", controller.deleteAllSheets);
  
};
