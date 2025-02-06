const User = require('../models/user');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

exports.signup = async (req, res) => {
  try {
    // Check for existing user
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        error:
          'This email is already registered. Please use a different email or try signing in.',
      });
    }

    // Create new user
    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    let newUser = new User({ name, email, password, profile, username });
    await newUser.save();

    res.json({
      message: 'Signup success! Please signin.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(400).json({
      error: 'Signup failed. Please try again later.',
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).json({
        error: 'User with this email does not exist. Please signup first.',
      });
    }

    //authenticate user
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Invalid password',
      });
    }

    //create jwt token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    //put token in cookie
    res.cookie('token', token, { expiresIn: '1d' });

    //return response
    const { _id, username, name, role } = user;
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Signin failed. Please try again.',
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'Signout success',
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});
