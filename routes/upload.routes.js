const controller = require("../controllers/file.controller");

module.exports = function(app) {
  
  app.post("/upload", controller.upload);
  app.post("/uploads", controller.uploads);
  app.get("/files", controller.getListFiles);
  app.get("/files/:name", controller.download);
  app.post("/user_upload", controller.userUpload)
  
};

// const controller = require("../controllers/file.controller");

// module.export = function(app) {
//   app.post("/upload", controller.upload);
//   app.get("/files", controller.getListFiles);
//   app.get("/files/:name", controller.download);
//   app.post("/user_upload", controller.userUpload)
  
// };


