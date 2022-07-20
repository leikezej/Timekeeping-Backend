module.exports = (sequelize, Sequelize) => {
   const User = sequelize.define("users", {
     name: {
       type: Sequelize.STRING
     },
     email: {
       type: Sequelize.STRING
     },
     birthdate: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING
    },
    address: {
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