import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Error handler middleware for Express routes
 * Catches unhandled errors and returns a 500 response with structured logging
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Structured error logging
      console.error('[API Error]', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        error: error.message,
        stack: error.stack,
      });
      
      // Return 500 error if not already sent
      if (!res.headersSent) {
        res.status(500).json({ 
          error: 'Internal Server Error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });
  };
}

/**
 * Method guard middleware - returns 405 for unsupported methods
 */
export function allowMethods(allowedMethods: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ 
        error: 'Method Not Allowed',
        allowed: allowedMethods 
      });
    }
    next();
  };
}

/**
 * Parse request body based on content-type
 * Returns parsed body or throws descriptive error
 */
export async function parseRequestBody(req: Request): Promise<any> {
  const contentType = req.headers['content-type'] || '';
  
  // Express middleware should have already parsed JSON/urlencoded
  // This is a defensive check
  if (contentType.includes('application/json')) {
    return req.body;
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    return req.body;
  } else if (contentType.includes('multipart/form-data')) {
    // Note: multipart/form-data requires additional middleware like multer
    throw new Error('multipart/form-data requires additional configuration');
  }
  
  return req.body;
}
