module.exports = {
   HOST: "localhost",
   USER: "root",
   PASSWORD: "",
   DB: "timekeeping",
   dialect: "mysql",
   pool: {
     max: 5, 
     min: 0,
     acquire: 30000,
     idle: 10000
   }
 };