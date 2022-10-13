module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("sessions", {
   session_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    expires: {
      type: Sequelize.INTEGER
    },
    data: {
      type: Sequelize.STRING
    }
  });

  return Session;
};