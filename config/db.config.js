
const mongoose = require ("mongoose");
const colors = require ("colors");

mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;

const db = require("../models");
const Role = db.role;

const connectDB = async () => {
  let conn;
  initial();
  if (process.env.NODE_ENV === "development") {
      conn = await mongoose.connect(
          process.env.DB_DEV,
          {}
    //   );console.log('working on development');

    );console.log(
        `DEVELOPMENT Workspace`.white.underline.italic
    );

    // console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline)
    // console.log(`Error: ${error.message}`.underline.bold)

  } else if (process.env.NODE_ENV === "production") {
      conn = await mongoose.connect(
          process.env.DB_PROD,
          {}
          );console.log(
            `Production Workspace`.yellow.underline.italic
        );

} else if (process.env.NODE_ENV === "test") {
      conn = await mongoose.connect(
          process.env.DB_TEST,
          {}
          );console.log(
            `Testing Workspace`
        );
  }
      console.log(
      `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
  );
    // console.log(`Error: ${error.message}`.underline.bold)

  return conn;
};

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "employee"
        // id: 1
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log('Added EMPLOYEE To Roles Collection');
      });

      new Role({
        name: "moderator"
        // id:  2
      }).save(err => {
        if (err) {
          console.log("error", err);
          // console.log(`error, ${err.message}`.underline.bold);
        }
        // console.log(`${success.message}`.underline.bold);
        console.log('Added MODERATOR To Roles Collection');

      });
      
      new Role({
        name: "admin"
        // id: 3
      }).save(err => {
        if (err) {
          console.log("error", err);
          // console.log(`error, ${err.message}`.underline.bold);
        }
        console.log('Added ADMIN To Roles Collection');
      });
    }
  });
};

module.exports = connectDB;
