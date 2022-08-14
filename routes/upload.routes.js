const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

let routes = (app) => {
  router.post("/auth/upload", controller.upload);
  router.get("/auth/files", controller.getListFiles);
  router.get("/auth/files/:name", controller.download);
  app.use(router);
};
module.exports = routes;