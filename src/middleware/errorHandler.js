import { ValidationError, NotFoundError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.correlationId || 'unknown';

  console.error(`Error (${correlationId}):`, err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
      correlationId
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: 'error',
      message: err.message,
      correlationId
    });
  }

  // Handle TypeORM specific errors
  if (err.name === 'QueryFailedError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database query error',
      detail: err.message,
      correlationId
    });
  }

  // Handle other errors
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    correlationId
  });
};

export default errorHandler;
