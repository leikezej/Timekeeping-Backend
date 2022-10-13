const dotenv = require('dotenv');
dotenv.config();
const http = require("http");
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

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 0420;

const fs = require('fs');
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

app.get("/", (req, res) => {
  res.send("<h2>It's Working!</h2>");
});

//if we are here then the specified request is not found
app.use((req,res,next)=> {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
 
//all other requests are not implemented.
app.use((err,req, res, next) => {
   res.status(err.status || 501);
   res.json({
       error: {
           code: err.status || 501,
           message: err.message
       }
   });
});
 

app.use(jepskiUploader({
  createParentPath: false
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
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        // maxAge: TWO_HOURS,
        sameSite: true,
        // secure: IN_PROD
    }
}))


app.post('/upload-avatar', async (req, res, next) => {
    const files = req.files
        console.log(files)
    Object.keys(files).forEach(key => {
    const filepath = path.join(__dirname, '/assets/uploads', files[key].name)
        files[key].mv(filepath, (err) => {
            if (err) 
         return res.status(500).send(err);
                res.send({
          status: true,
          message: 'File Uploaded to' + filepath,
          data: {
              name: req.files.name,
              mimetype: req.files.mimetype,
              size: req.files.size
          }
      });
        })
    })
});

app.post('/api/user/uploader', function(req, res) {
  let uploadedFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({
      status: false,
      message: 'No File Uploaded'
    });
  }

  uploadedFile = req.files.uploadedFile;
  uploadPath = __dirname + '/assets/uploads/' + uploadedFile.name;

  uploadedFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send({
        status: true,
        message: 'File Uploaded to' + uploadPath,
        data: {
            name: uploadedFile.name,
            mimetype: uploadedFile.mimetype,
            size: uploadedFile.size
        }
    });
  });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/timesheet.routes')(app);
require('./routes/upload.routes')(app);

app.listen(port, hostname, function ()  {
    console.log(`Server running at http://${hostname}:${port}`);
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