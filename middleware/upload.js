// const util = require("util");
// const multer = require("multer");
// const maxSize = 2 * 1024 * 1024;

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "/assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     // sampleFile = req.files.sampleFile;
//     console.log(req.file.originalname);
//     cb(null, req.file.originalname);
//   },
// });

// let uploadFile = multer({
//   // name: originalname,
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");

// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;
