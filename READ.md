    let type = req.params.type
    let userId = req.user.id;
    let user = await User.findById(userId);
    let attendance = await AttendanceRecord.find({userId: userId});
    let lastAttendanceReport = attendance.pop();
    
    if (user.isClockIn === false) {
        if (user.isClockIn === true) {
            return next(new ErrorResponse(404, "You already Clocked-in"));
        }
        
        attendance = await AttendanceRecord.create({
            login: moment().format("YYYY-MM-DD"),
            userId: userId
        })
        user.isClockIn = true;
        user.status = 'Online';
        user.save();
    } else {
        let diff;

        attendance = await AttendanceRecord.findOneAndUpdate({
            _id: lastAttendanceReport._id,
            userId: userId
        },
        {
            logout: moment.utc().format("YYYY-MM-DD"),
            duration: moment(attendance.logout, "YYY-MM-DD HH:mm:ss").diff(attendance.login, "YYY-MM-DD HH:mm:ss")
        },
        {
            new: true
        })

        user.isClockIn = false;
        user.status = 'Offline';
        await user.save();

    }



    res.status(200).json({
        c: 200,
        m: "Success",
        d: {}
    })


    import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

const { TokenExpiredError } = jwt;

export const auth = asyncHandler(async(req, res, next) => {
  let token = req.cookies.authToken;
  
  User.findByToken(token, (err, user) => {
  if (err) throw err;
  if (!user) return res.json({ isAuth: false, error: true })
  req.token = token
  req.user = user;
  next();
 });
});

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
      return res.status(401).send({ message: "Unauthorized! Access Token Was Expired!" });
    }
    return res.sendStatus(401).send({ message: "Unauthorized!" });}

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split("Bearer ")[1];
    } else {
      return res.status(403).json({ 
        Error: 403,
        Text: 'Ooopss! Unauthorized Access Required',
        Type: 'Error',
        Message: 'No Token Found!'
      });
    }

    if (!token) {
        return res.status(403).json({
          text: "No token provided!",
          type: 'Error' });
      }

    try {
        jwt.verify(token, process.env.JWT_SECRET,  async (err, decoded) => {
            if (err) {
            return res.status(401).json({
              Error: 401,
              Text: 'Unauthorized Access Required',
              Type: 'Error',
              Message: 'No Token Found!'
            });
            }

            let user = await User.findById(decoded.id);

            req.user = user;
            req.userId = user.id;
            next();
        });
    } catch (error) {
        console.log(JSON.stringify({ message: 'invalidToken', errorMessage: error.message, errorTitle: error.name }));
        return next(new ErrorResponse(401, "Session Expired Please Relogin"));
    }
});

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(403, "Unauthorized Access"));
    }
    next();
};

export const verifyToken = asyncHandler(async(req, res, next) => {
    // let token = req.headers["x-access-token"];
    let token = req.headers["Bearer"];
    
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }
      req.userId = decoded.id;
      next();
    });
});

export const verify = asyncHandler(async(req, res, next) => {
      // Email
  User.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }

    // Phone
    User.findOne({
      phone: req.body.phone
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Phone is already in use!" });
        return;
      }

      next();
    });
  });
})

export const isLoggedIn = asyncHandler(async(req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
  try {
    // check if auth header exists
    if (req.headers.authorization) {
      // parse token from header
      const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  isLoggedIn,
};

// LOGOUT USER
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });


  console.log("You've already logout")
  res.status(200).send({
    Code: 200,
    Status: "Success! :)", 
    Message: "You've Already Logout" })
});