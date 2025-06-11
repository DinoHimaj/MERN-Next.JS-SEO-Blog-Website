'use strict';

/**
 * Enhanced error handler for MongoDB/Mongoose errors
 */

class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Get unique error field name from MongoDB duplicate key error
 */
const getUniqueFieldName = (error) => {
  try {
    // Handle different MongoDB error message formats
    if (error.keyPattern) {
      const fieldName = Object.keys(error.keyPattern)[0];
      return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    }

    // Fallback to string parsing for older MongoDB versions
    const match = error.message.match(/index: (.+?)_/);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }

    return 'Field';
  } catch (ex) {
    return 'Field';
  }
};

/**
 * Enhanced error handler with better error categorization
 */
const handleMongoError = (error) => {
  switch (error.code) {
    case 11000:
    case 11001:
      const fieldName = getUniqueFieldName(error);
      return new AppError(`${fieldName} already exists`, 400);

    case 11600:
      return new AppError('Duplicate value error', 400);

    default:
      return new AppError('Database operation failed', 500);
  }
};

/**
 * Handle Mongoose validation errors
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose cast errors (invalid ObjectId, etc.)
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

/**
 * Main error handler function
 */
exports.errorHandler = (error) => {
  console.error('Database Error:', error);

  // MongoDB duplicate key error
  if (error.code && (error.code === 11000 || error.code === 11001)) {
    return handleMongoError(error);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return handleValidationError(error);
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return handleCastError(error);
  }

  // Default error
  return new AppError(error.message || 'Something went wrong', 500);
};

exports.AppError = AppError;
