"use strict";

var moment = require('moment-timezone');

module.exports = function (sequelize, Sequelize, DataTypes) {
  var Timein = sequelize.define("timein", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    time: {
      allowNull: false,
      type: Sequelize.TIME // defaultValue: new Time(),
      // defaultValue: moment.utc().format('YYYY-MM-DD HH:mm:ss a'),

    },
    date: {
      defaultValue: new Date(),
      type: Sequelize.DATEONLY,
      allowNull: false // type: Sequelize.DATE
      // type: 'Array'

    },
    status: {
      type: Sequelize.STRING,
      defaultValue: "IN",
      allowNull: false
    }
  });
  return Timein;
};