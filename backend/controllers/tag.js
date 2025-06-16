const Tag = require('../models/tag');
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

    const tag = new Tag({ name, slug });
    const savedTag = await tag.save();

    res.status(201).json(savedTag);
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
    const data = await Tag.find({}).exec();
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
    const tag = await Tag.findOne({ slug }).exec();

    if (!tag) {
      return res.status(404).json({
        error: 'Tag not found',
      });
    }

    res.json(tag);
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
    const data = await Tag.findOneAndDelete({ slug }).exec();

    if (!data) {
      return res.status(404).json({
        error: 'Tag not found',
      });
    }

    res.json({
      message: 'Tag deleted successfully',
    });
  } catch (err) {
    const handledError = errorHandler(err);
    return res.status(handledError.statusCode || 400).json({
      error: handledError.message,
    });
  }
};
