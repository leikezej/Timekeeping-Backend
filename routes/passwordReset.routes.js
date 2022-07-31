// const {User} = require("../models/user.model.js");
// const Token = require('../models/token.model.js');
// const sendEmail = require('../utils/sendEmail');
// const Joi = require('joi');
// const crypto = require('crypto');
// const express = require('express');
// // const router = express.Router();

// // module.exports = function(app) {
// //     app.use(function(req, res, next) {
// //         // res.header(
// //         //     "Access-Control-Allow-Headers",
// //         //     "x-access-token, Origin, Content-Type, Accept"
// //         //     // "Authorization, Bearer + Token"
// //         //   );
// //           next();
// //     });

//     // app.post("/passwordReset", async (req, res) => {
//     //     try {
//     //         const schema = Joi.object({ email: Joi.string().email().required()});
//     //         const {error} = schema.validate(req.body);
//     //         if (error) return res.status(400).send(error.details[0].message);
    
//     //         const user = await User.findOneI({ email: req.body.email});
//     //         if(!user) return res.status(400).send("user given does not exist");
    
//     //         let token = await Token.findOneI({ user: "userId: user._id"});
//     //         if(!token){
//     //             token = await new Token ({
//     //                 userId: user._id,
//     //                 token: crypto.randomBytes(32).toString('hex'),
//     //             }).save()
//     //         }
    
//     //         const link = `${process.env.BASE_URL}/passwordReset/${user._id}/${token.token}`;
//     //         await sendEmail(user.email, "password reset", link);
    
//     //         res.send("password reset link sent to your email")
//     //     } catch (error) {
//     //         res.send("An Error occured");
//     //         console.log(error)
//     //     }
//     // });
    
//     // app.post("/:userId/:token", async (req, res) => {
//     //     try {
//     //         const schema = Joi.object({password: Joi.string().required()});
//     //         const {error} = schema.validate(req.body);
//     //         if (error) return res.status(400).send(error.details[0].message);
    
//     //         const user = await User.findById(req.params.userId);
//     //         if(!user) return res.status(400).send('Invalid link or Expired!');
    
//     //         const token = await Token.findOne({
//     //             userId: user._id,
//     //             token: req.params.token
//     //         });
//     //         if(!token) return res.status(400).send("invalid/expired link");
    
//     //         user.password = req.body.password
//     //             await user.save();
//     //             await token.delete();
    
//     //             res.send("password reset successfully"); 
//     //     } catch (error) {
//     //         res.send('An Error Occured');
//     //         console.log(error);
//     //     }
//     // }) 
// }
// // module.exports = router;  