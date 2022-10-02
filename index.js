const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const { logger } = require('./middleware/logEvents');
const controller = require("./controllers/file.controller");

const app = express();
const requestIp = require('request-ip');
const morgan = require('morgan');
const fileUpload = require("express-fileupload");

const path = require('path');
const multer = require('multer');
const maxSize = 2 * 1024 * 1024;

global.__basedir = __dirname;

app.use(morgan('dev'));
app.use(logger);

var corsOptions = {
  origin: "http://localhost:3000"
  // origin: "*"
};

const db = require("./models");
const Role = db.role ;
const User = db.user;

app.use(express.static("files"));

app.use(cors(corsOptions));
app.use(logger);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());
app.use(
  cookieSession({
    name: "bugtech-session",
    secret: "process.env.SESSION_SECRET",
    httpOnly: false
  })
);

app.use(express.static("uploads"));


//  db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
//  });


// handle storage using multer
// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, 'uploads');
//    },
//    filename: function (req, file, cb) {
//       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//    }
// });
// var upload = multer({ storage: storage });
  
// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, 'uploads');
//    },
//    filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//    }
// });
// var upload = multer({ storage: storage });

// app.post('/api/image-upload', upload.single('image'),(req, res) => {
//   const image = req.image;
//     res.send(apiResponse({message: 'File uploaded successfully.', image}));
// });
  
// function apiResponse(results){
//     return JSON.stringify({"status": 200, "error": null, "response": results});
// }

app.use('/uploads', express.static('uploads'));
// handle storage using multer
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
   }
});
 
var upload = multer({ storage: storage });


// handle single file upload
app.post('/upload-avatar', upload.single('dataFile'), (req, res, next) => {
   const file = req.file;
   if (!file) {
      return res.status(400).send({ message: 'Please upload a file.' });
   }
   var sql = "INSERT INTO `file`(`name`) VALUES ('" + req.file.filename + "')";
   var query = db.query(sql, function(err, result) {
       return res.send({ message: 'File is successfully.', file });
    });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/upload.routes')(app);
require('./routes/email.routes')(app);

const PORT = process.env.PORT || 0420;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
   Role.create({
     id: 0420,
     name: "user"
   });

   Role.create({
     id: 0230,
     name: "admin"
   });

  }