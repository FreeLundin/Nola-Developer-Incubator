import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Structured logging for API routes with consistent format
 */
export function logError(error: any, req: Request): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: error.message || 'Unknown error',
    stack: error.stack || 'No stack trace available',
  };
  
  console.error('[API Error]', JSON.stringify(logEntry, null, 2));
}

/**
 * Express middleware for handling async route errors
 * Wraps route handlers to catch both sync and async errors
 * 
 * @param handler - Express route handler (can be async)
 * @returns Wrapped handler with error catching
 * 
 * @example
 * app.get('/api/users', asyncHandler(async (req, res) => {
 *   const users = await getUsers();
 *   res.json(users);
 * }));
 */
export function asyncHandler(
  handler: RequestHandler
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(handler(req, res, next));
    } catch (error) {
      logError(error, req);
      
      // Don't send response if headers already sent
      if (!res.headersSent) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
      }
    }
  };
}

/**
 * Middleware to enforce allowed HTTP methods on a route
 * Returns 405 Method Not Allowed for unsupported methods
 * 
 * @param allowedMethods - Array of allowed HTTP methods (e.g., ['GET', 'POST'])
 * @returns Express middleware function
 * 
 * @example
 * app.use('/api/users', methodGuard(['GET', 'POST']));
 */
export function methodGuard(allowedMethods: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ 
        error: 'Method Not Allowed',
        allowedMethods 
      });
    }
    next();
  };
}

/**
 * Parse request body based on content-type header
 * Handles both JSON and form-data gracefully
 * 
 * @param req - Express request object
 * @returns Parsed body or throws error
 */
export async function parseRequestBody(req: Request): Promise<any> {
  const contentType = req.headers['content-type'] || '';
  
  // If body is already parsed by express.json() middleware
  if (req.body && Object.keys(req.body).length > 0) {
    return req.body;
  }
  
  // Provide helpful error for missing content-type
  if (!contentType) {
    throw new Error(
      'No Content-Type header provided. Please specify application/json or application/x-www-form-urlencoded'
    );
  }
  
  return req.body;
}
