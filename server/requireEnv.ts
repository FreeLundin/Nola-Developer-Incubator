/**
 * Utility to validate required environment variables and fail fast with clear errors.
 * 
 * This helps catch configuration issues early in the request lifecycle,
 * preventing FUNCTION_INVOCATION_FAILED errors in Vercel deployments.
 * 
 * @example
 * ```typescript
 * // At the start of an API route handler
 * requireEnv(['DATABASE_URL', 'SESSION_SECRET']);
 * ```
 */

/**
 * Validates that all required environment variables are present and non-empty.
 * 
 * @param keys - Array of environment variable names to check
 * @throws {Error} If any required environment variable is missing or empty
 */
export function requireEnv(keys: string[]): void {
  const missing: string[] = [];

  for (const key of keys) {
    const value = process.env[key];
    // Check if value is undefined/null or empty/whitespace-only
    if (value === undefined || value === null || value.trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please configure these in your Vercel project settings or .env file.`;
    throw new Error(message);
  }
}
