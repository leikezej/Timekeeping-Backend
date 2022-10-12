const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.timein = require("../models/timein.model.js")(sequelize, Sequelize);
db.timeout = require("../models/timeout.model.js")(sequelize, Sequelize);
db.timeSheet = require("./timesheet.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "user_id"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "user_id"
});


// db.timeout.belongsToMany(db.timein, {
//   through: "time_table",
//   foreignKey: "timeout.time",
//   otherKey: "user_id"
// })

// db.timein.belongsToMany(db.timeout, {
//   through: "time_table",
//   foreignKey: "timein_id",
//   otherKey: "timeout_id"
// })


// db.timein.belongsToMany(db.timeout, { through: 'Time_Table' });
// db.timeout.belongsToMany(db.timein, { through: 'Time_Table' });

// db.timeout.belongsTo(db.timein, {
//   foreignKey: 'start_time', targetKey: 'time'
// });

// db.timein.hasOne(db.timeout, {
//   foreignKey: 'end_time', targetKey: 'time'
// });

// db.timesheet.hasOne(db.timein, {
//    foreignKey: 'timeId', targetKey: 'time'
// })

// db.timesheet.hasOne(db.timeout, {
//    foreignKey: 'timeId', targetKey: 'time'
// })

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
