/**
 * Utility to validate required environment variables
 * Throws a descriptive error if any required variables are missing or empty
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
      `Please ensure these are configured in your Vercel project settings or .env file.`
    );
  }
}
