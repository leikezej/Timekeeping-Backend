// import dotenv from 'dotenv'
// dotenv.config()
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const { logger } = require('./middleware/logEvents');
const controller = require("./controllers/file.controller");
const app = express();
const requestIp = require('request-ip');
const morgan = require('morgan');

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

app.use(cors(corsOptions));

const db = require("./models");
const Role = db.role ;
const User = db.user;


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  cookieSession({
    name: "bugtech-session",
    secret: "jepski-cokes",
    httpOnly: false
  })
);

//  db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
//  });


// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Jepski application." });
// });

// app.get('/', (req, res) => {
//   const clientIp = requestIp.getClientIp(req);
//   console.log(clientIp);
// });

// var storage = multer.diskStorage({   
//    destination: (req, file, callBack) { 
//       callBack(null, './assets/new/uploads');    
//    }, 
//    filename:  (req, file, callBack) { 
//       callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//    }
// });

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, './assets/uploads/')
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
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
     id: 1,
     name: "user"
   });

   Role.create({
     id: 2,
     name: "admin"
   });

  }