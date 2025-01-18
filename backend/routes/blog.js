const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    data: 'hello from routes folder  blog.js file',
    time: new Date().toLocaleString(),
  });
});

module.exports = router;
