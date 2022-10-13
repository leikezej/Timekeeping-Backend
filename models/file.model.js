module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
     type: {
       type: Sequelize.STRING
     },
 
    });
    return File;
  };