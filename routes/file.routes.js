// const controller = require("../controllers/file.controller");
const fileWorker = require("../controllers/upload.controller.js");

const upload = require("../config/upload.config");

let path = __basedir + '/views/';

module.exports = function(app) {

  // app.post("/api/user/timein", controller.create);
  
  // app.get("/api/user/timein", controller.findAll);
  // app.get("/api/user/timein/:id", controller.findOne);
  // app.put("/api/user/timein/:id", controller.update);
  // app.delete("/api/user/timein/:id", controller.delete);
  // app.delete("/api/user/timein", controller.deleteAll);
  // app.get("/api/user/timein/published", controller.findAllPublished);
  
  app.get("/", (req, res) => {
    res.sendFile(path + "index.html");
  });
  

  app.post('/api/file/upload', upload.single("file"), fileWorker.uploadFile);
  
  app.post('/api/file/multiple/upload', upload.array('files', 4), fileWorker.uploadMultipleFiles);
  
  app.get('/api/file/info', fileWorker.listAllFiles);
  
  app.get('/api/file/:id', fileWorker.downloadFile);
  
};
