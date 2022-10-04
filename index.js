const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const cors = require("cors");
const { logger } = require('./middleware/logEvents');
const morgan = require('morgan');
const cookieSession = require("cookie-session");
const fileUpload = require('express-fileupload');
const app = express();

const db = require("./models");
const Role = db.role;

global.__basedir = __dirname;

db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });


var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(fileUpload());

app.use(cors());
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
    // httpOnly: false,
    httpOnly: true,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);

app.post('/uploader', function(req, res) {
  let uploadedFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadedFile = req.files.uploadedFile;
  uploadPath = __dirname + '/assets/uploads/' + uploadedFile.name;

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to JEPSKI application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/upload.routes')(app);

const PORT = process.env.PORT || 0420;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "admin"
  });
 
  Role.create({
    id: 2,
    name: "user"
  });
  
  Role.create({
    id: 3,
    name: "moderator"
  });
}