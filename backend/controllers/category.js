const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    let slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // Check if category already exists
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
    console.error('Category creation error:', err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Category name or slug already exists',
      });
    }

    return res.status(400).json({
      error: err.message || 'Category creation failed',
    });
  }
};
