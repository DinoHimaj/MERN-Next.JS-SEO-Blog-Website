const Category = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

//create
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

//list
exports.list = async (req, res) => {
  try {
    const data = await Category.find({}).exec();
    res.json(data);
  } catch (err) {
    const handledError = errorHandler(err);
    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};

//read
exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const category = await Category.findOne({ slug }).exec();

    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    res.json(category);
  } catch (err) {
    const handledError = errorHandler(err);
    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};

//remove
exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const data = await Category.findOneAndDelete({ slug }).exec();

    if (!data) {
      return res.status(404).json({
        error: 'Category not found',
      });
    }

    res.json({
      message: 'Category deleted successfully',
    });
  } catch (err) {
    const handledError = errorHandler(err);
    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};
