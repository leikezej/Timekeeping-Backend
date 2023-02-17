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

const connectDB = require("./config/db.config.js");
dotenv.config({ path: './config/config.env'});

const app = express();

connectDB();

if (process.env.NODE_ENV === 'development') {
    // app.use(morgan('dev'));
    dotenv.config({ path:  '../.'})
    app.use(logger("dev"));
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
}

// CORS
app.use(
    cors({
      origin: '*',
    })
)

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))

// API Routes
// app.use('/api/user', userRoutes)


app.get("/api/jep", function (req, res)  {
    // res.render("testing", { title: "About dogs", message: "Dogs rock!" });
    // res.sendFile(__dirname + '/index.html')
    res.json({ message: "Welcome to bezkoder application." });
});

// const PORT = process.env.PORT || 6060
// app.listen(
//   PORT,
//   console.log(
//     `Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`
//       .yellow.bold
//   )
// )

app.listen(process.env.PORT, () => {
    const HOST = '127.0.0.1';
    const PORT = process.env.PORT || 6060

    console.log(
        // `Server Running with ${process.env.NODE_ENV} on http://${host}:${port}!!!`.yellow.bold
        `Server running in ${process.env.NODE_ENV} mode on http://${HOST}:${PORT}`
      .red.bold
    );
    // console.log('hello'.green); // outputs green text
});
