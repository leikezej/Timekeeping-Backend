const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");
const ip = require('ip');

module.exports = (sequelize, Sequelize) => {
  const UserIp = sequelize.define("userIp", {
    ip_address: {
      type: Sequelize.STRING,
      defaultValue: 'ip.address()',
    },
    loginAt: {
      type: Sequelize.DATE,
    },
  });
  
  UserIp.getIp = async function (user) {
    let loginAt = new Date();
    loginAt.setSeconds(loginAt.getSeconds() + config.jwtRefreshExpiration);
    let _user = uuidv4();
    let UserIp = await this.create({
   // res.send("Your IP address is " + ip.address());
      token: _user,
      id: user.id,
      expiryDate: loginAt.getTime(),
    });
    return UserIp.token;
  };
  UserIp.verifyExpiration = (token) => {
    return token.loginAt.getTime() < new Date().getTime();
  };
  return UserIp;
};