import express from 'express';
import { attachRoutes } from './routes';

// Create Express app and attach routes once (cached across lambda invocations where possible)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
attachRoutes(app);

// Vercel expects a default export that is a handler
export default function handler(req: any, res: any) {
  // Use the Express app to handle the request
  app(req, res);
}
