const moment = require('moment-timezone');

module.exports = (sequelize, Sequelize, DataTypes) => {
   const Timein = sequelize.define("timein", {
     name: {
       type: Sequelize.STRING,
       allowNull: false,
     },
     time: {
      allowNull: false,
      type: Sequelize.TIME,
      // defaultValue: new Time(),
      // defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss a'),
    },
    date: {
      defaultValue: new Date(),
      type: Sequelize.DATEONLY,
      allowNull: false
      // type: Sequelize.DATE
      // type: 'Array'
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "IN",
      allowNull: false
    }
   });
   return Timein;
 };