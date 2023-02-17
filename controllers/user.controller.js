// const registerUser = (async (req, res) => {
//   const { firstName, email, password } = req.body

//   // check if email exists in db
//   const userExists = await User.findOne({ email })

//   if (userExists) {
//     res.status(404)
//     throw new Error('User already exists')
//   }

//   // create new user document in db
//   const user = await User.create({ firstName, email, password })

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       firstName: user.firstName,
//       email: user.email,
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid user data')
//   }
// })

// const loginUser = (async (req, res) => {
//   const { email, password } = req.body

//   // check if user email exists in db
//   const user = await User.findOne({ email })

//   // return user obj if their password matches
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       firstName: user.firstName,
//       email: user.email,
//       userToken: generateToken(user._id),
//     })
//   } else {
//     res.status(401)
//     throw new Error('Invalid email or password')
//   }
// })

// const getUserProfile = (async (req, res) => {
//   // req.user was set in authMiddleware.js
//   const user = await User.findById(req.user._id)

//   if (user) {
//     res.json({
//       id: user._id,
//       firstName: user.firstName,
//       email: user.email,
//     })
//   } else {
//     res.status(404)
//     throw new Error('User not found')
//   }
// })

// exports.allAccess = (req, res) => {
//   res.status(200).send("Public Content.");
// };

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };