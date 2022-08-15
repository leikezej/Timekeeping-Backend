module.exports = (sequelize, Sequelize) => {
   const Timein = sequelize.define("timein", {
    //  id: {
    //    type: Sequelize.INTEGER,
    //    primaryKey: true,
    //  },
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
   return Timein;
 };