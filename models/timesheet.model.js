module.exports = (sequelize, Sequelize) => {
   const Timesheet = sequelize.define("timesheet", {
     id: {
      type: Sequelize.INTEGER
     },
      user_id: {
      type: Sequelize.INTEGER
     },
      name: {
      type: Sequelize.STRING
     },
    date: {
      type: Sequelize.DATEONLY
    },
   start_time: {
      type: Sequelize.TIME
    },
   end_time: {
     type: Sequelize.RANGE(Sequelize.TIME)
      // type: Sequelize.TIME
      // type: DataTypes.RANGE(DataTypes.DATE),
    },
  total_time: {
    type: Sequelize.TIMERANGE
  },
     comments: {
       type: Sequelize.STRING
     },
     date_submitted: {
      type: Sequelize.DATETIME
    },
   });
   return Timesheet;
 };