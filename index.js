// import dotenv from 'dotenv'
// dotenv.config()
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { logger } = require('./middleware/logEvents');
const controller = require("./controllers/file.controller");
const app = express();
// const router = express.Router();
const path = require('path');
const multer = require('multer')

global.__basedir = __dirname;

app.use(logger);

var corsOptions = {
  origin: "http://localhost:3000"
  // origin: "*"
};

const db = require("./models");
const Role = db.role ;
const User = db.user;

 db.sequelize.sync();
//  db.sequelize.sync({force: true}).then(() => {
//    console.log('Drop and Resync Db');
//    initial();
//  });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Use of Multer
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './assets/images/')     
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage
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