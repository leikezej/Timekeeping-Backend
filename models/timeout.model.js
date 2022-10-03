module.exports = (sequelize, Sequelize, DataTypes) => {
   const Timeout = sequelize.define("timeout", {
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
      defaultValue: "OUT",
      allowNull: false
    }
   });
   return Timeout;
 };