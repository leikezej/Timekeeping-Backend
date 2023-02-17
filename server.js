const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const logger = require("morgan");
const colors = require ("colors");
const cors = require ("cors");
const cookieParser = require('cookie-parser');
const bodyParser= require('body-parser')
const cookieSession = require('cookie-session')
const session = require('express-session');

const connectDB = require("./config/db.config.js");
const { Session } = require('inspector');
dotenv.config({ path: './config/config.env'});
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
    dotenv.config({ path:  '../.'})
    app.use(logger("dev"));
};

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
};

// CORS
app.use(
    cors({
      // origin: '*',
      origin: "http://localhost:5050",
      credentials:  true
    })
);

// Express Session
app.use(session({
  secret: '123jepski',
  resave: false,
  saveUninitialized: true,
  cookie: {
  maxAge: 60000
  }
}));

// Cookie Session
  app.use(
  cookieSession({
    name: "jepskey-session",
    // keys: ['key1', 'key2'], 
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

require('./routes/auth.routes')(app);
// require('./routes/user.routes')(app);


app.listen(process.env.PORT, () => {
    const PORT = process.env.PORT || 6060
    const HOST = process.env.HOST;
    
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on http://${HOST}:${PORT}`
      .red.bold
    );
    // console.log('hello'.green); // outputs green text
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
        // console.log(`${success.message}`.underline.bold)
      });



      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
          // console.log(`error, ${err.message}`.underline.bold);
        }
        // console.log(`${success.message}`.underline.bold);
        console.log("added 'admin' to roles collection");
      });
    }
  });
};


