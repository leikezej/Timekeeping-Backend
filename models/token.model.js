module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {
        user_id: {
           type: Sequelize.STRING
    },
          token: {
           type: Sequelize.STRING
          },
          createdAt: {
            type: Sequelize.DATE
          },
    });
    return Token;
  };