
const mongoose = require ("mongoose");
const colors = require ("colors");

mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;

const connectDB = async () => {
  let conn;

  if (process.env.NODE_ENV === "development") {
      conn = await mongoose.connect(
          process.env.DB_DEV,
          {}
    //   );console.log('working on development');

    );console.log(
        `Development Workspace`.magenta.underline.italic
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
            `Testing Workspace`.orange.underline.italic
        );
  }
      console.log(
      `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
  );
    // console.log(`Error: ${error.message}`.underline.bold)

  return conn;
};

module.exports = connectDB;
