import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export const requestLogger = (req, res, next) => {
  const correlationId = req.correlationId || 'unknown';

  // Log request details
  logger.info({
    correlationId,
    method: req.method,
    path: req.path,
    queryParams: req.query,
    pathParams: req.params,
    body: req.method !== 'GET' ? req.body : undefined,
    headers: {
      ...req.headers,
      // Don't log potential sensitive headers like authorization
      authorization: req.headers.authorization ? '[REDACTED]' : undefined
    }
  });

  // Track response time
  const startTime = Date.now();

  // Override end method to log response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;

    logger.info({
      correlationId,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`
    });

    originalEnd.call(res, chunk, encoding);
  };

  next();
};

export default requestLogger;
