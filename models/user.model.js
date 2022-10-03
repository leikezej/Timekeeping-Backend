module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define("user", {
     name: {
       type: Sequelize.STRING
     },
     email: {
       type: Sequelize.STRING
     },
    phone: {
      type: Sequelize.STRING
    },
     password: {
       type: Sequelize.STRING
     }
   });
   return User;
 };