module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
     },
     name: {
       type: Sequelize.STRING,
        allowNull: false,
     },
     email: {
      allowNull: false,
       type: Sequelize.STRING,
       unique: true
     },
    phone: {
      allowNull: false,
      type: Sequelize.STRING
    },
     password: {
      allowNull: false,
      type: Sequelize.STRING
     }
   });
   return User;
 };