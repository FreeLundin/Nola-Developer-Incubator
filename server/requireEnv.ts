/**
 * Validates that required environment variables are present and non-empty.
 * Throws an error with a clear message if any are missing.
 * 
 * @param keys - Array of environment variable names to check
 * @throws Error if any required environment variables are missing or empty
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
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
