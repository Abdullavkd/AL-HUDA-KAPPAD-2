export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

export function errorHandler(err, req, res, next) {
  const knownStatus = Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600;
  const isValidationError = err.name === 'ValidationError' || err.name === 'CastError';
  const isDuplicateKey = err.code === 11000;
  const status = knownStatus
    ? err.statusCode
    : (isDuplicateKey ? 409 : (isValidationError ? 400 : 500));

  if (status >= 500) {
    // Keep detailed errors in server logs only; never return internal DB/config details to clients.
    console.error('Unhandled API error:', {
      name: err.name,
      message: err.message,
      path: req.originalUrl,
      method: req.method
    });
  }

  const message = isDuplicateKey
    ? 'A record with the same unique value already exists'
    : (knownStatus || isValidationError ? err.message : 'Internal server error');

  res.status(status).json({
    success: false,
    message,
    ...(knownStatus && err.details !== undefined ? { details: err.details } : {})
  });
}

