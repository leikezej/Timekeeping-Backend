module.exports = {
   HOST: process.env.DB_HOST,
   USER: process.env.DB_USER,
   PASSWORD: "",
   DB: process.env.DB_NAME,
   dialect: "mysql",
   pool: {
     max: 5, 
     min: 0,
     acquire: 30000,
     idle: 10000
   }
 };
 