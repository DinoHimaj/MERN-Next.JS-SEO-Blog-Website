const express = require('express');
const router = express.Router();

//controllers
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require('../controllers/auth');

//validators
const { runValidation } = require('../validators');
const {
  userSignupValidator,
  userSigninValidator,
} = require('../validators/auth');

//routes
router.post('/signup', userSignupValidator, runValidation, signup); // Register new user
router.post('/signin', userSigninValidator, runValidation, signin); // Login user
router.get('/signout', signout); // Logout user
//test

// router.get('/secret', requireSignin, (req, res) => {
//   console.log('req.user content:', req.auth);
//   res.json({
//     message: req.auth,
//     message2: 'You have access to secret data',
//   });
// });

module.exports = router;
