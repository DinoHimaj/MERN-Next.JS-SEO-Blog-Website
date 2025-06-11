const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    let slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // Check if category already exists (optional - the unique constraint will catch this too)
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(400).json({
        error: 'Category already exists',
      });
    }

    let category = new Category({ name, slug });
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (err) {
    // Use the centralized error handler
    const handledError = errorHandler(err);

    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};
