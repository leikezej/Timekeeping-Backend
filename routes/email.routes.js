const { authJwt, checkUserAuth } = require("../middleware");
const controller = require("../controllers/email.controller");

module.exports = function(app) {
      
      app.post("/api/auth/user/forgot-password", controller.forgotPassword);
      app.post("/api/auth/user/reset-password", controller.resetPassword);
      app.post("/api/auth/user/change-password", controller.changePassword);
};