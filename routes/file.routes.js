// // const controller = require("../controllers/file.controller");
// const fileWorker = require("../controllers/upload.controller.js");

// // const upload = require("../config/upload.config");

// let path = __basedir + '/views/';

// module.exports = function(app) {

//   app.get("/", (req, res) => {
//     res.sendFile(path + "index.html");
//   });
  

//   // app.post('/api/file/upload', upload.single("file"), fileWorker.uploadFile);
  
//   app.post('/api/file/multiple/upload', upload.array('files', 4), fileWorker.uploadMultipleFiles);
  
//   app.get('/api/file/info', fileWorker.listAllFiles);
  
//   app.get('/api/file/:id', fileWorker.downloadFile);
  
// };
