const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: './src/image/',
  filename: (req, file, cb) => {
    return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage : storage
})

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      'Access-Control-Allow-Origin: *',
      "x-access-token, Origin,  Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    upload.single('image'),
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshToken", controller.refreshToken);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/logout", controller.logout);
  
  
  app.post("/api/auth/v1/login", controller.login);
  app.post("/api/auth/v1/register", controller.register);
  app.delete("/api/auth/v1/logouts", controller.logouts);
  
  
  
  app.post("/api/auth/forgot-password", controller.forgotPassword);
  app.get("/api/auth/resets-password/:id/:token", controller.resetsPassword);
  app.post("/api/auth/reset-password/:id/:token", controller.resetPassword);
  
};
