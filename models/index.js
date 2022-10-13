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
db.file = require("../models/file.model.js")(sequelize, Sequelize);
db.timein = require("../models/timein.model.js")(sequelize, Sequelize);
db.timeout = require("../models/timeout.model.js")(sequelize, Sequelize);
db.timesheet = require("./timesheet.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);

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

// db.timein.belongsToMany(db.timeout, {
//   through: "time_sheets",
//   foreignKey: "timein_time",
//   otherKey: "timeout_time"
// })

// db.timeout.belongsToMany(db.timein, {
//   through: "time_sheets",
//   foreignKey: "timeout_time",
//   otherKey: "timein_time"
// })

// db.timeSheet.belongsTo(db.user,  {
//   foreignKey: 'user_id', targetKey:'id'
// });
// db.user.hasOne(db.timeSheet, {
//   foreignKey: 'user_id', targetKey: 'id'
// });

db.timesheet.belongsTo(db.user, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.user.hasOne(db.timesheet, {
  foreignKey: 'user_id', targetKey: 'id'
});


db.refreshToken.belongsTo(db.user, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.user.hasOne(db.refreshToken, {
  foreignKey: 'user_id', targetKey: 'id'
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

  // users.associate = function (models) {
  //   users.belongsToMany(models.roles, {
  //     through: "user_roles",
  //     foreignKey: "userId",
  //     otherKey: "roleId"    
  //   });


  //   users.belongsToMany(models.phones, {
  //     through: "user_phones",
  //     foreignKey: "userId",
  //     otherKey: "phoneId",
  //     constraints: false   
  //   });

  //   users.belongsTo(models.businesses, {
  //     foreignKey: 'businessId', as: "business"
  //   });
