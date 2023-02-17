const { verifySignUp, authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
      // "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
  
  app.get("/api/auth/profile", controller.profile);
  
};

// import express from 'express'
// import { protect } from '../middleware/authMiddleware.js'
// import * as userController from '../controllers/userController.js'

// const router = express.Router()

// router.post('/register', userController.registerUser)
// router.post('/login', userController.loginUser)
// router.route('/profile').get(protect, userController.getUserProfile)

// export default router