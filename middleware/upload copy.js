const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/assets/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

// let storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, 'uploads');
//    },
//    filename: function (req, file, cb) {
//       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//    }
// });


let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;