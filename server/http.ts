import type { Request, Response, NextFunction } from 'express';

/**
 * Error response structure
 */
interface ErrorResponse {
  error: string;
  timestamp?: string;
  path?: string;
  method?: string;
}

/**
 * Wraps an Express request handler with error handling.
 * Catches any errors thrown during request processing and returns a 500 response.
 * Also logs errors with structured information.
 * 
 * @param handler - The Express request handler to wrap
 * @returns A wrapped handler with error handling
 */
export function withErrorHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void> | void
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // Log the error with structured information
      console.error('[API Error]', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Return 500 error if response hasn't been sent yet
      if (!res.headersSent) {
        const errorResponse: ErrorResponse = {
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        };
        res.status(500).json(errorResponse);
      }
    }
  };
}

/**
 * Creates a method guard that returns 405 for unsupported HTTP methods.
 * 
 * @param allowedMethods - Array of allowed HTTP methods (e.g., ['GET', 'POST'])
 * @returns Express middleware that enforces the allowed methods
 */
export function requireMethod(allowedMethods: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({
        error: 'Method Not Allowed',
        allowed: allowedMethods,
      });
    }
    next();
  };
}
