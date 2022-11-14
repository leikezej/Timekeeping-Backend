<<<<<<< HEAD
const dotenv = require('dotenv');
dotenv.config()
=======
>>>>>>> f312411091f4baaaa7e4aa57ae421f7db1d25a91
const express = require("express");
const cors = require("cors");
const { logger } = require('./middleware/logEvents');
<<<<<<< HEAD
const morgan = require('morgan');
const cookieSession = require("cookie-session");
const session = require('express-session');
const jepskiUploader = require('express-fileupload');
const multer = require("multer");
const cookieParser = require("cookie-parser");

=======
const router = express.Router();;
const controller = require("./controllers/file.controller");
const app = express();
const requestIp = require('request-ip');
>>>>>>> f312411091f4baaaa7e4aa57ae421f7db1d25a91

const path = require('path');
const app = express();
const mysqlStore = require('express-mysql-session')(session);

global.__basedir = __dirname;

<<<<<<< HEAD
const db = require("./models");
const Role = db.role;

db.sequelize.sync(
    //  {force: true}
    ).then(() => {
        console.log('Drop and Resync Database!');
        // initial();
    }).catch(err => {
        console.log(err)
    });
=======
>>>>>>> f312411091f4baaaa7e4aa57ae421f7db1d25a91

var corsOptions = {
  // origin: "http://localhost:8081"
  origin: "*",
  credentials: true
};

const  sessionStore = new mysqlStore((db));

app.use(jepskiUploader({
  createParentPath: true
}));

<<<<<<< HEAD
app.use(cookieParser());
app.use(express.static('resources'));
app.use(logger);
app.use(morgan('dev'));
=======

app.use(logger);

>>>>>>> f312411091f4baaaa7e4aa57ae421f7db1d25a91
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: process.env.SESSION_COOKIE_NAME,
        // keys: ['key1', 'key2'], 
    secret: process.env.SESSION_COOKIE_SECRET,
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

app.use(session({
    name: process.env.SESSION_NAME,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        // maxAge: TWO_HOURS,
        sameSite: true,
        // secure: IN_PROD
    }
}))

app.get("/", (req, res) => {
  res.send("<h2>It's Working!</h2>");
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/timesheet.routes')(app);
// require('./routes/upload.routes')(app);
// require('./routes/file.routes')(app);

// const PORT = process.env.PORT || 0420;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });

const server = app.listen(0420, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("Backend Server running at http://%s:%s", host, port); 
})


function initial() {
<<<<<<< HEAD
  Role.create({
    id: 1,
    name: "moderator"
  });
 
  Role.create({
    id: 2,
    name: "user"
  });
  
  Role.create({
    id: 3,
    name: "admin"
  });
}
=======
   Role.create({
     id: 0420,
     name: "user"
   });

   Role.create({
     id: 0230,
     name: "admin"
   });

  }
>>>>>>> f312411091f4baaaa7e4aa57ae421f7db1d25a91
