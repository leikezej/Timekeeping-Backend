const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;

// const { user: User, role: Role, email: email, refreshToken: RefreshToken } = db;


exports.usePasswordHashToMakeToken = ({
    password: passwordHash,
    _id: user_id,
    createdAt
  }) => {
    // highlight-start
    const secret = passwordHash + "-" + createdAt
    const token = jwt.sign({ user_id }, secret, {
      expiresIn: 3600 // 1 hour
    })
    // highlight-end
    return token
};  
  
// getPasswordResetURL
exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.params
    let user
    try {
      user = await user.findOne({ email }).exec()
    } catch (err) {
      res.status(404).json("No user with that email")
    }
    const token = usePasswordHashToMakeToken(user)
    const url = getPasswordResetURL(user, token)
    const emailTemplate = resetPasswordTemplate
    resetPasswordTemplate(user, url)
  
    const sendEmail = () => {
      transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          res.status(500).json("Error sending email")
        }
        console.log(`** Email sent **`, info.response)
      })
    }
    sendEmail()
};

// receiveNewPassword
exports.receiveNewPassword = (req, res) => {
    const { user_id, token } = req.params
    const { password } = req.body
    // highlight-start
    User.findOne({ _id: user_id })
      .then(user => {
        const secret = user.password + "-" + user.createdAt
        const payload = jwt.decode(token, secret)
        if (payload.user_id === user.id) {
          bcrypt.genSalt(10, function(err, salt) {
            // Call error-handling middleware:
            if (err) return
            bcrypt.hash(password, salt, function(err, hash) {
              // Call error-handling middleware:
              if (err) return
              User.findOneAndUpdate({ _id: user_id }, { password: hash })
                .then(() => res.status(202).json("Password changed accepted"))
                .catch(err => res.status(500).json(err))
            })
          })
        }
      })
      .catch(() => {
        res.status(404).json("Invalid user")
      })
};

//  
exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body
  // find if old password is valid
  User.findOne({ email: email })
    .then(oldUser => {
      if (!oldUser) return res.status(404).send("User does not exist")
      oldUser.comparePassword(oldPassword, (err, isMatch) => {
        if (err) {
          return res.status(401).send("Unauthorized")
        }
        if (isMatch) {
          // change to new password
          oldUser.password = newPassword
          oldUser
            .save()
            .then(newUser => {
              res.status(200).send(newUser)
            })
            .catch(err => {
              const message = err.message
              res.status(500).json({
                status: "change password failed",
                msg: message
              })
            })
        } else {
          return res.status(401).send("Invalid old password")
        }
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
};
