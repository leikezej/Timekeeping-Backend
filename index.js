const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const cors = require("cors");
const { logger } = require('./middleware/logEvents');
const morgan = require('morgan');
const cookieSession = require("cookie-session");
const app = express();



const db = require("./models");
const Role = db.role;

db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });


var corsOptions = {
  origin: "http://localhost:8081"
};


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


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to JEPSKI application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/timein.routes')(app);

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