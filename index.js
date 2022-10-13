const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const cors = require("cors");
const { logger } = require('./middleware/logEvents');
const morgan = require('morgan');
const cookieSession = require("cookie-session");
const session = require('express-session');
const jepskiUploader = require('express-fileupload');
const path = require('path');
const app = express();
const mysqlStore = require('express-mysql-session')(session);

global.__basedir = __dirname;


const db = require("./models");
const Role = db.role;

db.sequelize.sync();
//   db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

var corsOptions = {
  // origin: "http://localhost:8081"
  origin: "*"
};

const  sessionStore = new mysqlStore((db));

app.use(jepskiUploader({
  createParentPath: true
}));

app.use(logger);
app.use(morgan('dev'));
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
require('./routes/upload.routes')(app);

const PORT = process.env.PORT || 0420;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 111,
    name: "moderator"
  });
 
  Role.create({
    id: 222,
    name: "user"
  });
  
  Role.create({
    id: 333,
    name: "admin"
  });
}