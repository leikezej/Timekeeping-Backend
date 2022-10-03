"use strict";

var controller = require("../controllers/file.controller");

var upload = require("../middleware/upload");

module.exports = function (app) {
  app.post("/uploader", controller.uploader);
  app.post("/upload", controller.upload);
  app.post("/uploads", controller.uploads);
  app.post("/uploadss", controller.uploadss);
  app.post("/uploadd", controller.uploadd);
  app.post("/uploadds", controller.uploadds);
  app.get("/files", controller.getListFiles);
  app.get("/files/:name", controller.download);
  app.post("/user_upload", controller.userUpload);
  app["delete"]("/files/remove", controller.remove);
  app["delete"]("/files/removeSync", controller.removeSync);
}; // const controller = require("../controllers/file.controller");
// module.export = function(app) {
//   app.post("/upload", controller.upload);
//   app.get("/files", controller.getListFiles);
//   app.get("/files/:name", controller.download);
//   app.post("/user_upload", controller.userUpload)
// };
// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/file.controller");
// let routes = (app) => {
//   router.post("/upload", controller.upload);
//   router.get("/files", controller.getListFiles);
//   router.get("/files/:name", controller.download);
//   router.post("/user/user_upload", controller.user_upload);
//   app.use(router);
// };
// module.exports = routes;