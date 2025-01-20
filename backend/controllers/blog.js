exports.time = (req, res) => {
  res.json({
    data: 'hello from routes folder  blog.js file',
    time: new Date().toLocaleString(),
  });
};
