const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

let routes = (app) => {

  router.post("/api/user/upload", controller.upload);
  router.get("/api/user/files", controller.getListFiles);
  router.get("/api/user/files/:name", controller.download);
  router.delete("/api/user/files/:name", controller.remove);

  app.use(router);
};

module.exports = routes;