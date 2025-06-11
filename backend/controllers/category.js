const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const category = new Category({ name, slug });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    const handledError = errorHandler(err);
    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};
