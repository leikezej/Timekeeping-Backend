const moment = require('moment-timezone');

module.exports = (sequelize, Sequelize) => {
   const Timein = sequelize.define("timein", {
     name: {
       type: Sequelize.STRING,
       allowNull: false,
      //  default: name,
     },
     time: {
      allowNull: false,
      // defaultValue: new Time(),
      
      type: Sequelize.TIME,
      // type: Sequelize.TIME,
      // defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss a'),
    },
    date: {
      // type: Sequelize.DATE
      defaultValue: new Date(),
      type: Sequelize.DATEONLY,
      allowNull: false
      // type: 'Array'
    }
   });
   return Timein;
 };