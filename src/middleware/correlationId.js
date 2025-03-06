import { v4 as uuidv4 } from 'uuid';

export const correlationIdMiddleware = (req, res, next) => {
  // Use existing correlation ID from header or generate a new one
  const correlationId = req.headers['x-correlation-id'] || uuidv4();

  // Add correlation ID to request object for later use
  req.correlationId = correlationId;

  // Add correlation ID to response headers
  res.setHeader('x-correlation-id', correlationId);

  next();
};

export default correlationIdMiddleware;
