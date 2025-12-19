import serverless from 'serverless-http';
import createApp from './express-app';

// Create the express app but DO NOT call listen(); serverless-http will handle requests
const app = createApp();

// Export a handler compatible with Vercel's Node runtime
export const handler = serverless(app);
export default handler;

