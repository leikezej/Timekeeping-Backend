const express = require("express");
const router = express.Router();
const controller = require("../controllers/file.controller");

const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "./assets/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: fileStorageEngine });

let routes = (app) => {

  router.post("/api/user/upload", controller.upload);
  
  router.post("/api/user/uploader", controller.uploader);

  router.post("/api/user/userUpload", controller.userUpload);
  
  router.post("/api/user/single-upload", upload.single("image"),controller.singleUpload);
  
  router.post("/api/user/multiple-upload", upload.array("images", 5),controller.multipleUpload);
  
  router.get("/api/user/files", controller.getListFiles);
  
  router.get("/api/user/files/:name", controller.download);
  
  router.delete("/api/user/files/:name", controller.remove);

  app.use(router);
};

module.exports = routes;
