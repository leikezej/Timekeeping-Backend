module.exports = (sequelize, Sequelize) => {
  const Timesheet = sequelize.define("timesheet", {
    name: {
      type: Sequelize.STRING
    },
    time_start: {
      type: Sequelize.TIME,
      foreignKey: true,
    },
    time_end: {
      type: Sequelize.TIME,
      otherKey: true,
    },
    time_total: {
      type: Sequelize.STRING
    }
  });
    return Timesheet;
};
