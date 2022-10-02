module.exports = (sequelize, Sequelize, DataTypes) => {
   const Role = sequelize.define("roles", {
     id: {
       type: Sequelize.INTEGER,
       primaryKey: true
     },
     name: {
       type: Sequelize.STRING
     }
   });
   return Role;
 };