exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  res.json({
    message: 'Signup success!',
    user: { name, email, password },
  });
};
