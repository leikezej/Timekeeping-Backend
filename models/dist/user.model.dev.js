"use strict";

module.exports = function (sequelize, Sequelize, DataTypes) {
  var User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // type: DataTypes.UUID,
      // defaultValue: Sequelize.UUIDV4,

    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
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
    // avatar: {
    //   // allowNull: false,
    //   type: Sequelize.STRING
    // },
    // otp: {
    //   type: Sequelize.INTEGER
    // },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    }
  });
  return User;
};