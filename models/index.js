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
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);
db.userIp = require("../models/userIp.model.js")(sequelize, Sequelize);
db.timein = require("../models/timein.model.js")(sequelize, Sequelize);
db.timeout = require("../models/timeout.model.js")(sequelize, Sequelize);
// db.timesheet = require("../models/timesheet.model.js")(sequelize, Sequelize);
db.file = require("../models/file.model.js")(sequelize, Sequelize);
db.upload = require("../models/file.model.js")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

db.timein.belongsToMany(db.timeout, {
  through: "timesheet",
  as: "time_tags",
  foreignKey: "time_start"
})

db.timeout.belongsToMany(db.timein, {
  through: "timesheet",
  as: "time_tags",
  foreignKey: "time_end"
})


// db.timein.belongsToMany(db.user, {
//   through: "timesheets",
//   foreignKey: "start_time",
//   otherKey: "end_time",
//   // otherKey: "total_time",
// });

// db.user.belongsToMany(db.role, {
//   through: "timesheets",
//   foreignKey: "user_id",
//   otherKey: "timesheet_id"
// });

// db.timeout.belongsTo(db.user, {
//   foreignKey: 'user_id', targetKey: 'id'
// });

// db.user.hasOne(db.timeout, {
//   foreignKey: 'user_id', targetKey: 'id'
// });

// db.timein.belongsTo(db.user, {
//   foreignKey: 'user_id', targetKey: 'id'
// });

// db.user.hasOne(db.timein, {
//   foreignKey: 'user_id', targetKey: 'id'
// });

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.userIp.belongsTo(db.user, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.user.hasOne(db.userIp, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.ROLES = ["user", "admin"];
module.exports = db;
