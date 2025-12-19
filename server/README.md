# Server Utilities Documentation

This directory contains server-side utilities for the Express.js application, designed to improve error handling and prevent `FUNCTION_INVOCATION_FAILED` errors in Vercel deployments.

## Files

### `requireEnv.ts`

Environment variable validation utility that fails fast with clear error messages.

**Purpose:** Catch missing environment variables early in the request lifecycle before they cause runtime errors.

**Usage:**
```typescript
import { requireEnv } from './requireEnv';

// In an API route or at application startup
app.get('/api/data', (req, res) => {
  // Validate required env vars before processing
  requireEnv(['DATABASE_URL', 'API_KEY']);
  
  // Continue with route logic...
});
```

**Function Signature:**
```typescript
function requireEnv(keys: string[]): void
```

**Behavior:**
- Checks that each environment variable in `keys` is defined and non-empty
- Throws an `Error` with a descriptive message if any are missing
- Error message includes all missing variables for easy debugging

**Example Error:**
```
Error: Missing required environment variables: DATABASE_URL, API_KEY. 
Please configure these in your Vercel project settings or .env file.
```

---

### `http.ts`

Express.js error handling utilities and middleware for robust API routes.

#### `asyncHandler`

Wraps async Express route handlers to catch errors automatically.

**Usage:**
```typescript
import { asyncHandler } from './http';

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await storage.getUsers();
  res.json(users);
}));
```

**Benefits:**
- Eliminates need for manual try-catch in every route
- Automatically logs errors with structured context
- Returns 500 JSON response on errors
- Prevents unhandled promise rejections

---

#### `methodGuard`

Middleware to enforce allowed HTTP methods and return 405 for unsupported methods.

**Usage:**
```typescript
import { methodGuard } from './http';

// Only allow GET and POST
app.all('/api/users', methodGuard(['GET', 'POST']));
app.get('/api/users', asyncHandler(getUsers));
app.post('/api/users', asyncHandler(createUser));
```

**Benefits:**
- Clear error messages for wrong HTTP methods
- Returns proper 405 status code
- Lists allowed methods in response

---

#### `logError`

Structured error logging for debugging and monitoring.

**Usage:**
```typescript
import { logError } from './http';

try {
  await someOperation();
} catch (error) {
  logError(error, req);
  throw error;
}
```

**Log Format:**
```json
{
  "timestamp": "2024-12-19T12:00:00.000Z",
  "method": "POST",
  "path": "/api/users",
  "error": {
    "message": "Database connection failed",
    "stack": "Error: Database connection failed\n    at ...",
    "name": "Error"
  }
}
```

---

#### `parseRequestBody`

Safe request body parsing based on Content-Type header.

**Usage:**
```typescript
import { parseRequestBody } from './http';

app.post('/api/data', asyncHandler(async (req, res) => {
  const data = await parseRequestBody(req);
  // Process data...
}));
```

**Supported Content Types:**
- `application/json` - Parsed as JSON
- `application/x-www-form-urlencoded` - Parsed as form data
- `multipart/form-data` - Parsed as form data

---

#### `createErrorMiddleware`

Creates standardized error handling middleware for Express.

**Usage:**
```typescript
import { createErrorMiddleware } from './http';

// Add as the last middleware in your app
app.use(createErrorMiddleware());
```

**Features:**
- Catches all unhandled errors
- Logs with structured format
- Returns appropriate status codes
- Includes stack traces in development only
- Prevents duplicate responses

---

## Best Practices

### 1. Environment Variable Validation

Always validate environment variables at the start of routes that need them:

```typescript
app.post('/api/send-email', asyncHandler(async (req, res) => {
  // Validate early, fail fast
  requireEnv(['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD']);
  
  // Use environment variables safely
  await sendEmail(process.env.SMTP_HOST, ...);
}));
```

### 2. Wrap All Async Routes

Use `asyncHandler` for all async route handlers:

```typescript
// ✅ Good - errors are caught
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await storage.getUsers();
  res.json(users);
}));

// ❌ Bad - unhandled promise rejections
app.get('/api/users', async (req, res) => {
  const users = await storage.getUsers();
  res.json(users);
});
```

### 3. Method Validation

Guard routes that support limited HTTP methods:

```typescript
// Only allow POST for create operations
app.all('/api/users', methodGuard(['POST']));
app.post('/api/users', asyncHandler(createUser));
```

### 4. Error Middleware Last

Always add the error middleware as the very last middleware:

```typescript
// Register all routes first
app.get('/api/users', asyncHandler(getUsers));
app.post('/api/users', asyncHandler(createUser));

// Error middleware goes last
app.use(createErrorMiddleware());
```

---

## Integration with Vercel

These utilities are designed to work seamlessly with Vercel's serverless Node.js runtime:

1. **Environment Variables**: Configure in Vercel dashboard → Project Settings → Environment Variables
2. **Logging**: All console output appears in Vercel's function logs
3. **Error Handling**: Prevents `FUNCTION_INVOCATION_FAILED` by catching all errors gracefully
4. **Runtime**: Works with `@vercel/node` builder specified in `vercel.json`

### Viewing Logs in Vercel

1. Go to your project dashboard
2. Click **Deployments**
3. Select a deployment
4. Click **Functions** tab
5. View real-time logs with error context

---

## Troubleshooting

### Missing Environment Variables

**Symptom:** Error message about missing environment variables

**Solution:**
1. Check error message for specific variable names
2. Add them in Vercel project settings
3. Redeploy the application

### FUNCTION_INVOCATION_FAILED

**Symptom:** Vercel error during function execution

**Common Causes:**
1. Unhandled promise rejections → Use `asyncHandler`
2. Missing environment variables → Use `requireEnv`
3. Synchronous errors in initialization → Add try-catch
4. Invalid JSON in request body → Already handled by middleware

**Solution:**
- Check function logs in Vercel dashboard
- Look for stack traces in the error logging output
- Verify all required environment variables are set

### Timeout Errors

**Symptom:** Function times out after 10 seconds (free tier)

**Solutions:**
1. Optimize database queries
2. Use database connection pooling
3. Consider upgrading to Vercel Pro (60s timeout)
4. Break long operations into smaller chunks

---

## Further Reading

- [Vercel Function Errors Documentation](https://vercel.com/docs/errors/FUNCTION_INVOCATION_FAILED)
- [Express Error Handling Guide](https://expressjs.com/en/guide/error-handling.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
