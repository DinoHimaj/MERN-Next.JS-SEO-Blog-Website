const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { firstValues } = require('formidable/src/helpers/firstValues.js');

exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fieldsMultiple, filesMultiple) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload',
      });
    }

    // Convert arrays to single values using formidable's helper
    const fields = firstValues(form, fieldsMultiple);
    const files = firstValues(form, filesMultiple);

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'title is required',
      });
    }

    if (!body || body.length < 200) {
      return res.status(400).json({
        error: 'Content is too short',
      });
    }

    if (!categories || categories.length === 0) {
      return res.status(400).json({
        error: 'At least one category is required',
      });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({
        error: 'At least one tag is required',
      });
    }

    try {
      // Parse categories and tags (expecting comma-separated ObjectIds)
      let arrayOfCategories =
        categories && categories.split(',').map((id) => id.trim());
      let arrayOfTags = tags && tags.split(',').map((id) => id.trim());

      // Validate that categories exist in database (REQUIRED)
      const foundCategories = await Category.find({
        _id: { $in: arrayOfCategories },
      });
      if (foundCategories.length !== arrayOfCategories.length) {
        return res.status(400).json({
          error: 'One or more categories not found',
        });
      }

      // Validate that tags exist in database (REQUIRED)
      let foundTags = [];
      if (arrayOfTags && arrayOfTags.length > 0) {
        foundTags = await Tag.find({ _id: { $in: arrayOfTags } });
        if (foundTags.length !== arrayOfTags.length) {
          return res.status(400).json({
            error: 'One or more tags not found',
          });
        }
      }

      // Create blog object
      let blog = new Blog();
      blog.title = title;
      blog.body = body;
      blog.slug = `${slugify(title).toLowerCase()}`;
      blog.mtitle = `${title} | ${process.env.APP_NAME}`;
      blog.mdesc = stripHtml(body.substring(0, 160)).result;
      blog.postedBy = req.auth._id;

      // Add categories and tags as ObjectIds
      blog.categories = arrayOfCategories;
      blog.tags = arrayOfTags;

      // Handle file upload
      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: 'Image should be less than 1mb in size',
          });
        }
        blog.photo.data = fs.readFileSync(files.photo.filepath);
        blog.photo.contentType = files.photo.mimetype;
      }

      // Save blog with all data at once
      const savedBlog = await blog.save();

      res.status(201).json({
        message: 'Blog created successfully',
        blog: savedBlog,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Blog creation error:', error);
      const handledError = errorHandler(error);
      return res.status(handledError.statusCode || 400).json({
        error: handledError.message,
      });
    }
  });
};
