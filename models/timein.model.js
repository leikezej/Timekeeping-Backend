module.exports = (sequelize, Sequelize) => {
   const Timein = sequelize.define("timein", {
     name: {
       type: Sequelize.STRING
     },
     time: {
      type: Sequelize.TIME
    },
    date: {
      type: Sequelize.DATEONLY
    }
   });
   return Timein;
 };