const normalizeValidationErrors = (err) => {
  if (err.name === 'ValidationError') {
    return Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (err.name === 'CastError') {
    return [{ field: err.path, message: 'Invalid resource identifier' }];
  }

  return err.errors;
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const isValidationError = err.name === 'ValidationError';
  const isCastError = err.name === 'CastError';
  const statusCode = err.statusCode || (isValidationError || isCastError ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: normalizeValidationErrors(err),
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
