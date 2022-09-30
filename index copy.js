// import dotenv from 'dotenv'
// dotenv.config()
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const { logger } = require('./middleware/logEvents');
const router = express.Router();
const controller = require("./controllers/file.controller");
const app = express();
const requestIp = require('request-ip');
const morgan = require('morgan');

const path = require('path');
const multer = require('multer');
const util = require("util");
const maxSize = 2 * 1024 * 1024;
// const upload = multer({dest:'./assets/uploads'}).single("single");

global.__basedir = __dirname;

app.use(morgan('dev'));
app.use(logger);

var corsOptions = {
  origin: "http://localhost:3000"
  // origin: "*"
};

app.use(cors(corsOptions));

// const db = require("./models");
const db = require("./config/db.config");
const Role = db.role ;
const User = db.user;

//  db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
//  });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cors(corsOptions));
app.use(express.json());
app.use(
  cookieSession({
    name: "bugtech-session",
    secret: "jepski-cokes",
    httpOnly: false
  })
);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to Jepski application." });
});

app.get('/',function(request, response) {
  var clientIp = requestIp.getClientIp(request);
  console.log(clientIp);
});

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './assets/uploads/')     
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
      // callBack(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
})

var upload = multer({
  storage: storage
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './assets/uploads/')
//   },
//   filename: (req, file, cb) => {
//     // const ext = file.mimetype.split("/")[1];
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     // cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
//   },
// });

// var storage = multer.diskStorage({   
//    destination: function(req, file, cb) { 
//       cb(null, './assets/new/uploads');    
//    }, 
//    filename: function (req, file, cb) { 
//       cb(null , file.originalname);   
//    }
// });
// const upload = multer({
//   storage: storage,
//   // fileFilter: multerFilter,
// });

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, './uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __basedir + "./assets/uploads/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file.originalname);
//     cb(null, file.originalname);
//   },
// });

// let upload = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");


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
     id: 1,
     name: "user"
   });

   Role.create({
     id: 2,
     name: "admin"
   });

  }