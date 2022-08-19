module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("file", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
     file: {
       type: Sequelize.STRING
     },
 
    });
    return File;
  };