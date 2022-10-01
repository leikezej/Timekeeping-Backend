const controller = require("../controllers/file.controller");

module.exports = function(app) {
  app.post("/auth/upload", controller.upload);
  app.get("/auth/files", controller.getListFiles);
  app.get("/auth/files/:name", controller.download);
  app.delete("/auth/files/:name", controller.remove);
  app.post("/auth/user/user_upload", controller.user_upload);
};