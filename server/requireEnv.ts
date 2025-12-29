/**
 * Utility to validate required environment variables and fail fast with a clear error.
 * Use this at the start of API route handlers to ensure all required env vars are present.
 * 
 * @param keys - Array of environment variable names that must be defined and non-empty
 * @throws Error if any required environment variable is missing or empty
 * 
 * @example
 * // At the top of an API route handler:
 * requireEnv(['DATABASE_URL', 'API_KEY']);
 */
export function requireEnv(keys: string[]): void {
  const missing: string[] = [];
  
  for (const key of keys) {
    const value = process.env[key];
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      `Please configure these in your Vercel project settings or .env file.`
    );
  }
}
