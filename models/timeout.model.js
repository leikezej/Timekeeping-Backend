module.exports = (sequelize, Sequelize) => {
   const Timeout = sequelize.define("timeout", {
     name: {
       type: Sequelize.STRING
     },
     time: {
      type: Sequelize.TIME
    },
    date: {
      type: Sequelize.DATEONLY
    },

   });
   return Timeout;
 };