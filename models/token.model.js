module.exports = (sequelize, Sequelize, DataTypes) => {
    const Token = sequelize.define("token", {
        userId: {
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