const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/auth');
//validators
const { runValidation } = require('../validators');
const { userSignupValidator } = require('../validators/auth');

//POST /api/signup user registration
router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;
