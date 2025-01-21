const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/auth');
//validators
const { runValidation } = require('../validators');
const { userSignupValidator } = require('../validators/auth');

console.log('signup:', signup);
console.log('runValidation:', runValidation);
console.log('userSignupValidator:', userSignupValidator);

router.post('/signup', userSignupValidator, runValidation, signup);

module.exports = router;
