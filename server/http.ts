/**
 * HTTP utilities for Express.js API routes to improve error handling and prevent
 * FUNCTION_INVOCATION_FAILED errors in Vercel deployments.
 * 
 * Provides middleware and wrappers for:
 * - Structured error handling
 * - HTTP method validation
 * - Request/response logging
 * - Graceful error responses
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Structured error logging for API routes
 */
export function logError(error: unknown, req: Request): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  
  console.error(JSON.stringify({
    timestamp,
    method,
    path,
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : {
      message: String(error),
    },
  }, null, 2));
}

/**
 * Wrap an Express route handler with error handling.
 * Catches any thrown errors and returns a 500 JSON response.
 * 
 * @example
 * ```typescript
 * app.get('/api/users', asyncHandler(async (req, res) => {
 *   const users = await storage.getUsers();
 *   res.json(users);
 * }));
 * ```
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logError(error, req);
      
      // Don't send response if headers already sent
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : String(error))
            : undefined,
        });
      }
    }
  };
}

/**
 * Middleware to enforce allowed HTTP methods for a route.
 * Returns 405 Method Not Allowed for unsupported methods.
 * 
 * @example
 * ```typescript
 * app.all('/api/users', methodGuard(['GET', 'POST']));
 * app.get('/api/users', asyncHandler(async (req, res) => { ... }));
 * app.post('/api/users', asyncHandler(async (req, res) => { ... }));
 * ```
 */
export function methodGuard(allowedMethods: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        error: 'Method Not Allowed',
        allowedMethods,
      });
    }
    next();
  };
}

/**
 * Parse request body based on Content-Type header.
 * Provides defensive parsing to prevent errors from mismatched content types.
 * 
 * @example
 * ```typescript
 * app.post('/api/data', asyncHandler(async (req, res) => {
 *   const data = await parseRequestBody(req);
 *   // data is either JSON object or FormData
 * }));
 * ```
 */
export async function parseRequestBody(req: Request): Promise<any> {
  const contentType = req.headers['content-type'] || '';
  
  // Express middleware should have already parsed JSON
  if (contentType.includes('application/json')) {
    return req.body;
  }
  
  // For form data, body should already be parsed by express.urlencoded
  if (contentType.includes('application/x-www-form-urlencoded') || 
      contentType.includes('multipart/form-data')) {
    return req.body;
  }
  
  // Default to returning parsed body if available
  return req.body;
}

/**
 * Create a standardized error response middleware for Express.
 * This should be added as the last middleware in the app.
 * 
 * @example
 * ```typescript
 * app.use(createErrorMiddleware());
 * ```
 */
export function createErrorMiddleware() {
  return (err: any, req: Request, res: Response, _next: NextFunction) => {
    logError(err, req);
    
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    if (!res.headersSent) {
      res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: err.stack,
        }),
      });
    }
  };
}
