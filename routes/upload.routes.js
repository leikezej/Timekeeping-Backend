const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.post("/uploads", controller.uploads);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.post("/user_upload", controller.userUpload)
  
  app.use(router);
};

module.exports = routes;

// const controller = require("../controllers/file.controller");

// module.export = function(app) {
//   app.post("/upload", controller.upload);
//   app.get("/files", controller.getListFiles);
//   app.get("/files/:name", controller.download);
//   app.post("/user_upload", controller.userUpload)
  
// };


