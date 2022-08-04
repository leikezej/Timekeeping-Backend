const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const router = express.Router();
const controller = require("./controllers/file.controller");
const app = express();
global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:3000"
  // origin: "*"
};

const db = require("./models");
const Role = db.role ;

db.sequelize.sync();
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "bugtech-session",
    secret: "COOKIE_SECRET",
    httpOnly: false
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Jepski application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);
require('./routes/timeout.routes')(app);
require('./routes/upload.routes')(app);

const PORT = process.env.PORT || 8080;
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
     name: "moderator"
   });
  
   Role.create({
     id: 3,
     name: "admin"
   });
 }