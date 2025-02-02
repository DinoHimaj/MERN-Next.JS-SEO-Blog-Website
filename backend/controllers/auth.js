const User = require('../models/user');
const shortId = require('shortid');

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
