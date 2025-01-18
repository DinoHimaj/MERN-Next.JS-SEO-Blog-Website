const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

//routes
const blogRoutes = require('./routes/blog');

//app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log('DB connection error:', err));

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//routes middleware
app.use('/api', blogRoutes);

//cors
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes
app.get('/api', (req, res) => {
  res.json({
    data: 'hello from api test2',
    time: new Date().toLocaleString(),
  });
});

//port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
