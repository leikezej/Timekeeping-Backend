module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("tokens", {
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