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

const fs = require('fs');
global.__basedir = __dirname;


const db = require("./models");
const Role = db.role;

db.sequelize.sync();
  // db.sequelize.sync({force: true}).then(() => {
  // console.log('Drop and Resync Db');
  // initial();
// });


var corsOptions = {
  // origin: "http://localhost:8081"
  origin: "*"
};
const  sessionStore = new mysqlStore((db));
app.use(jepskiUploader({
  createParentPath: false
}));
app.use(logger);
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/assets/uploads", express.static(path.join(__dirname, "/assets/uploads")));
app.use(
  cookieSession({
    name: process.env.SESSION_COOKIE_NAME,
        // keys: ['key1', 'key2'], 
    // secret: process.env.SESSION_COOKIE_SECRET,
    secret: process.env.SESSION_COOKIE_SECRET,
    // httpOnly: false,
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
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadedFile = req.files.uploadedFile;
  uploadPath = __dirname + '/assets/uploads/' + uploadedFile.name;

  // Use the mv() method to place the file somewhere on your server
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

// simple route
app.get('/black', function(req, res) {
  res.send('Jack');
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